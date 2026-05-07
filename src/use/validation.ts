import type { Errors, Validatable, ValidationRules, ValidationState } from '@/types';
import {
	ref,
	computed,
	type ComputedRef,
	unref,
	watch,
	type InjectionKey,
	type Ref,
	inject,
	watchEffect,
	shallowRef,
	provide,
	type MaybeRefOrGetter,
	toValue,
	getCurrentInstance,
	onUnmounted
} from 'vue';

const ValidationSymbol: InjectionKey<Ref<ValidationState>> = Symbol('vuelidate');

const validationRegistry = new Map<string, ValidationState>();
const validationRefs = new Map<string, Ref<ValidationState | undefined>>();
let autoValidationId = 0;

export function registerValidation(name: string, state: ValidationState): void {
	validationRegistry.set(name, state);

	const validationRef = validationRefs.get(name);
	if (validationRef) {
		validationRef.value = state;
	}
}

export function getValidation(name: string): ValidationState | undefined {
	return validationRegistry.get(name);
}

export function useNamedValidation(name: string): Ref<ValidationState | undefined> {
	if (!validationRefs.has(name)) {
		const validationRef = ref<ValidationState | undefined>(validationRegistry.get(name));
		validationRefs.set(name, validationRef as Ref<ValidationState | undefined>);
	}

	return validationRefs.get(name)!;
}

export function unregisterValidation(name: string): boolean {
	const result = validationRegistry.delete(name);

	const validationRef = validationRefs.get(name);
	if (validationRef) {
		validationRef.value = undefined;
	}

	return result;
}

export type ValidationResult<T extends object> = ComputedRef<ValidationState<T>> &
	ValidationState<T>;

export type ValidationRulesResult<T extends Record<string, Validatable>> = ComputedRef<
	ValidationRules<T>
>;
export type ValidationStateSource<T extends Record<string, Validatable>> = MaybeRefOrGetter<T>;

export function useValidation<T extends Record<string, Validatable>>(
	state: ValidationStateSource<T>,
	rules: MaybeRefOrGetter<ValidationRules<T>>,
	name?: string
): ValidationResult<T> {
	const $dirty = ref(false);
	const $ruleErrors = ref({}) as Ref<Errors<T>>;
	const $externalErrors = ref({}) as Ref<Errors<T>>;
	const $pending = ref(false);
	const $touched = shallowRef<Set<keyof T>>(new Set());
	const $children = ref<Record<string, ValidationState<object>>>({});
	let validationRunId = 0;

	const $touch = () => {
		$dirty.value = true;
		$touchField(Object.keys(toValue(rules)) as (keyof T)[]);
		for (const key in $children.value) {
			$children.value[key].$touch();
		}
	};

	const $reset = () => {
		$resetValidation();
		for (const key in $children.value) {
			$children.value[key].$reset();
		}
	};

	const $resetValidation = () => {
		$dirty.value = false;
		$touched.value = new Set([]);
		$externalErrors.value = {};
	};

	const $touchField = (field: keyof T | (keyof T)[]) => {
		$dirty.value = true;
		const fieldsToAdd = Array.isArray(field) ? field : [field];
		$touched.value = new Set([...unref($touched), ...fieldsToAdd]);
	};

	const $resetField = (field: keyof T | (keyof T)[]) => {
		const fieldsToRemove = Array.isArray(field) ? field : [field];
		const currentTouched = unref($touched);
		const newTouched = new Set(currentTouched);

		fieldsToRemove.forEach((field) => {
			newTouched.delete(field);
		});

		$touched.value = newTouched;
	};

	const $setExternalErrors = (errors: Errors<T>) => {
		$externalErrors.value = errors;
	};

	const $clearExternalErrors = (field?: keyof T | (keyof T)[]) => {
		if (!field) {
			$externalErrors.value = {};
			return;
		}

		const fieldsToRemove = Array.isArray(field) ? field : [field];
		const nextErrors = { ...$externalErrors.value };

		fieldsToRemove.forEach((field) => {
			delete nextErrors[field];
		});

		$externalErrors.value = nextErrors;
	};

	const $silentErrors = computed<Errors<T>>(() => {
		const errors: Errors<T> = {};
		const keys = new Set<keyof T>([
			...(Object.keys($ruleErrors.value) as (keyof T)[]),
			...(Object.keys($externalErrors.value) as (keyof T)[])
		]);

		for (const key of keys) {
			const fieldErrors = [
				...($ruleErrors.value[key] ?? []),
				...($externalErrors.value[key] ?? [])
			];

			if (fieldErrors.length) {
				errors[key] = fieldErrors;
			}
		}

		return errors;
	});

	const $errors = computed<Errors<T>>(() => {
		const errors: Errors<T> = {};
		const plainErrors = toValue($silentErrors);
		const keys = Object.keys(plainErrors) as (keyof T)[];
		for (const key of keys) {
			if ($silentErrors.value[key]?.length && $touched.value.has(key)) {
				errors[key] = $silentErrors.value[key];
			}
		}
		return errors;
	});

	const $message = computed(() => {
		const messages = {} as Record<keyof T, string>;
		const errors = $errors.value;
		const keys = Object.keys(errors) as (keyof T)[];

		for (const key of keys) {
			const value = errors[key];
			if (value?.length) {
				messages[key] = value[0];
			}
		}

		return messages;
	});

	const runValidation = async (
		fields?: (keyof T)[],
		commitWhenCurrent = false
	): Promise<Errors<T>> => {
		const runId = ++validationRunId;
		$pending.value = true;

		const currentState = toValue(state);
		const currentRules = toValue(rules);
		const nextErrors: Errors<T> = fields ? { ...$ruleErrors.value } : {};
		const keys = (fields ?? (Object.keys(currentRules) as (keyof T)[])).filter(
			(key) => currentRules[key]
		);

		for (const key of keys) {
			const ruleSet = currentRules[key];
			if (!ruleSet) continue;

			const ruleResults = await Promise.all(
				ruleSet.map(async (rule) => {
					const resolvedRule = unref(rule);
					if (!resolvedRule) return true;

					try {
						const result = await resolvedRule(unref(currentState[key]), currentState);
						return typeof result === 'string' ? result : null;
					} catch (error) {
						return error instanceof Error ? error.message : String(error);
					}
				})
			);

			const filteredResults = ruleResults.filter(
				(result): result is string => typeof result === 'string'
			);

			if (filteredResults.length > 0) {
				nextErrors[key] = filteredResults;
			} else {
				delete nextErrors[key];
			}
		}

		const shouldCommit =
			runId === validationRunId ||
			(commitWhenCurrent &&
				keys.every((key) => unref(toValue(state)[key]) === unref(currentState[key])));

		if (shouldCommit) {
			$ruleErrors.value = nextErrors;
			$pending.value = false;
		}

		return nextErrors;
	};

	const $validateField = async (field: keyof T): Promise<boolean> => {
		$touchField(field);
		const validationErrors = await runValidation([field], true);
		return !validationErrors[field]?.length && !$externalErrors.value[field]?.length;
	};

	const $validate = async (): Promise<boolean> => {
		$touch();
		await runValidation();

		const childResults = await Promise.all(
			Object.keys($children.value).map((key) => $children.value[key].$validate())
		);

		return !$silentInvalid.value && childResults.every(Boolean);
	};

	watch(
		[() => ({ ...toValue(state) }), () => toValue(rules)],
		async () => {
			await runValidation();
		},
		{ immediate: true }
	);

	const $silentInvalid = computed(() => {
		return (
			Object.keys($silentErrors.value).length > 0 ||
			Object.values($children.value).some((child) => child.$silentInvalid)
		);
	});
	const $invalid = computed(() => $silentInvalid.value);
	const $valid = computed(() => !$invalid.value);
	const $error = computed(() => {
		return (
			Object.keys($errors.value).length > 0 ||
			Object.values($children.value).some((child) => child.$error)
		);
	});
	const $isPending = computed(() => {
		return $pending.value || Object.values($children.value).some((child) => child.$pending);
	});

	const validationState = computed<ValidationState<T>>(() => ({
		$touch,
		$touched,
		$reset,
		$resetValidation,
		$validate,
		$resetField,
		$touchField,
		$validateField,
		$setExternalErrors,
		$clearExternalErrors,
		$dirty: $dirty.value,
		$pending: $isPending.value,
		$invalid: $invalid.value,
		$valid: $valid.value,
		$error: $error.value,
		$silentInvalid: $silentInvalid.value,
		$message: $message.value,
		$errors: $errors.value,
		$silentErrors: $silentErrors.value,
		$children: $children.value
	}));

	const instance = getCurrentInstance();
	if (instance) {
		const parent = inject(ValidationSymbol, null);
		if (parent) {
			const key = name || (autoValidationId++).toString();
			watchEffect(() => {
				parent.value.$children[key] = validationState.value;
			});

			onUnmounted(() => {
				delete parent.value.$children[key];
			});
		}

		if (name) {
			watchEffect(() => {
				registerValidation(name, validationState.value);
			});

			onUnmounted(() => {
				unregisterValidation(name);
			});
		}

		provide(ValidationSymbol, validationState);
	} else if (name) {
		watchEffect(() => {
			registerValidation(name, validationState.value);
		});
	}

	return validationState as ValidationResult<T>;
}

export type Vuelidate = Ref<ValidationState>;

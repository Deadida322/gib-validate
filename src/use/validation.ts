import type {
	Errors,
	Validatable,
	ValidationRules,
	ValidationState,
	ValidationRule
} from '@/types';
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
	type Reactive,
	shallowRef,
	provide,
	type MaybeRefOrGetter,
	toValue
} from 'vue';

const ValidationSymbol: InjectionKey<Ref<ValidationState>> = Symbol('vuelidate');

const validationRegistry = new Map<string, ValidationState>();
const validationRefs = new Map<string, Ref<ValidationState | undefined>>();

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
export function useValidation<T extends Record<string, Validatable>>(
	state: Reactive<T>,
	rules: MaybeRefOrGetter<ValidationRules<T>>,
	name?: string
): ValidationResult<T> {
	const $dirty = ref(false);
	const $silentErrors = ref({}) as Ref<Errors<T>>;
	const $touched = shallowRef<Set<keyof T>>(new Set());
	const $children = ref<Record<string, ValidationState<object>>>({});

	const $touch = () => {
		$dirty.value = true;
		$touchField(Object.keys(unref(rules)) as (keyof T)[]);
		Object.entries($children.value).forEach(([_key, child]) => {
			(child as ValidationState<object>).$touch();
		});
	};

	const $reset = () => {
		$dirty.value = false;
		$touched.value = new Set([]);
		Object.entries($children.value).forEach(([_key, child]) => {
			(child as ValidationState<object>).$reset();
		});
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
		return Object.entries($errors.value).reduce(
			(acc, [key, value]) => {
				if (!value?.length) return acc;
				acc[key as keyof T] = value[0];
				return acc;
			},
			{} as Record<keyof T, string>
		);
	});

	watch(
		[() => ({ ...(state as T) }), () => rules],
		async ([currentState, currentRules]) => {
			const newErrors: Errors<T> = {};
			const resolvedRules = unref(currentRules) as ValidationRules<T>;

			for (const key in resolvedRules) {
				const ruleSet = resolvedRules[key];
				if (ruleSet) {
					const ruleResults = await Promise.all(
						(ruleSet as Array<ValidationRule<T[typeof key]>>).map(async (rule) => {
							if (!rule) return true;
							const result = await rule(unref(currentState[key]));
							return typeof result === 'string' ? result : null;
						})
					);

					const filteredResults = ruleResults.filter(
						(result): result is string => typeof result === 'string'
					);

					if (filteredResults.length > 0) {
						newErrors[key] = filteredResults;
					}
				}
			}
			$silentErrors.value = newErrors;
		},
		{ immediate: true }
	);

	const validationState = computed<ValidationState<T>>(() => ({
		$touch,
		$touched,
		$reset,
		$resetField,
		$touchField,
		$dirty: $dirty.value,
		$message: $message.value,
		$errors: $errors.value,
		$silentErrors: $silentErrors.value,
		$children: $children.value
	}));

	const parent = inject(ValidationSymbol, null);
	if (parent) {
		watchEffect(() => {
			const key = name || Object.keys(parent.value.$children).length.toString();
			parent.value.$children[key] = validationState.value;
		});
	}

	if (name) {
		watchEffect(() => {
			registerValidation(name, validationState.value);
		});

		watchEffect(() => {
			return () => {
				unregisterValidation(name);
			};
		});
	}

	provide(ValidationSymbol, validationState);
	return validationState as ValidationResult<T>;
}

export type Vuelidate = Ref<ValidationState>;

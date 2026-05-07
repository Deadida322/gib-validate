import type { ComputedRef } from 'vue';

export type ValidationState<T extends object = object> = {
	$touch: () => void;
	$reset: () => void;
	$resetValidation: () => void;
	$validate: () => Promise<boolean>;
	$touchField: (field: keyof T | (keyof T)[]) => void;
	$resetField: (field: keyof T | (keyof T)[]) => void;
	$validateField: (field: keyof T) => Promise<boolean>;
	$setExternalErrors: (errors: Errors<T>) => void;
	$clearExternalErrors: (field?: keyof T | (keyof T)[]) => void;
	$dirty: boolean;
	$pending: boolean;
	$invalid: boolean;
	$valid: boolean;
	$error: boolean;
	$silentInvalid: boolean;
	$errors: Errors<T>;
	$silentErrors: Errors<T>;
	$message: Message<T>;
	$children: Record<string, ValidationState<object>>;
};

export type Validatable =
	| string
	| number
	| boolean
	| Array<Validatable>
	| object
	| null
	| undefined;

export type ValidationRuleResult = string | boolean;
export type MaybePromise<T> = T | Promise<T>;

export type ValidationRule<TValue, TState extends object = object> = (
	value: TValue,
	state: TState
) => MaybePromise<ValidationRuleResult>;

export type ValidationRules<T extends object> = {
	[K in keyof T]?: (ValidationRule<T[K], T> | ComputedRef<ValidationRule<T[K], T>>)[];
};

export type Errors<T extends object> = Partial<Record<keyof T, string[]>>;
export type Message<T extends object> = Partial<Record<keyof T, string>>;

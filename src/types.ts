import type { ComputedRef } from 'vue';

export type ValidationState<T extends object = object> = {
	$touch: () => void;
	$reset: () => void;
	$touchField: (field: keyof T | (keyof T)[]) => void;
	$resetField: (field: keyof T | (keyof T)[]) => void;
	$dirty: boolean;
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

export type ValidationRule<T> = (value: T) => string | boolean | Promise<string | boolean>;

export type ValidationRules<T> = {
	[K in keyof T]?: (ValidationRule<T[K]> | ComputedRef<ValidationRule<T[K]>>)[];
};

export type Errors<T extends object> = Partial<Record<keyof T, string[]>>;
export type Message<T extends object> = Partial<Record<keyof T, string>>;

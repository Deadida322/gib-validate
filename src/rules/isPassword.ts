import { isEmptyValue } from './utils';

export const isPassword =
	(
		minLen = 8,
		hasSpecialChar = true,
		error = `password must be at least ${minLen} chars and contain special characters`
	) =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		if (value.length < minLen) return error;

		if (hasSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return error;

		return true;
	};

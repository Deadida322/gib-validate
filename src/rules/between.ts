import { isEmptyValue } from './utils';

export const between =
	(min: number, max: number, error = `value must be between ${min} and ${max}`) =>
	(value: number | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		if (value < min || value > max) return error;
		return true;
	};

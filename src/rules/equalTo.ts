import { isEmptyValue } from './utils';

export const equalTo =
	<T>(target: T, error = 'value must be equal to target') =>
	(value: T | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		if (value !== target) return error;
		return true;
	};

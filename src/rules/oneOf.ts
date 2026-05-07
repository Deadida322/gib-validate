import { isEmptyValue } from './utils';

export const oneOf =
	<T>(list: T[], error = 'invalid value') =>
	(value: T | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		if (!list.includes(value as T)) return error;
		return true;
	};

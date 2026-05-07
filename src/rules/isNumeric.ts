import { isEmptyValue } from './utils';

export const isNumeric =
	(error = 'value is not a number') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		if (isNaN(Number(value))) return error;
		return true;
	};

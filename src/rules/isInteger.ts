import { isEmptyValue } from './utils';

export const isInteger =
	(error = 'value is not an integer') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		if (!Number.isInteger(Number(value))) return error;
		return true;
	};

import { isEmptyValue } from './utils';

export const isDate =
	(error = 'invalid date') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		const date = new Date(value);
		if (isNaN(date.getTime())) return error;
		return true;
	};

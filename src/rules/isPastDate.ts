import { isEmptyValue } from './utils';

export const isPastDate =
	(error = 'date must be in the past') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) return true;
		const now = new Date();
		const date = new Date(value);

		if (date >= now) return error;
		return true;
	};

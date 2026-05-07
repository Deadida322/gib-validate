import { isEmptyValue } from './utils';

export const isPhone =
	(error = 'invalid phone number') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) {
			return true;
		}

		const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
		if (!phoneRegex.test(value)) {
			return error;
		}
		return true;
	};

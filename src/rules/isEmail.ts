import { isEmptyValue } from './utils';

export const isEmail =
	(error = 'invalid email') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) {
			return true;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (value.length > 254 || !emailRegex.test(value)) {
			return error;
		}

		return true;
	};

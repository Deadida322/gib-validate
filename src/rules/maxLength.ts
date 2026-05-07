import { isEmptyValue } from './utils';

export const maxLength =
	(max: number, error = 'value too long') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) {
			return true;
		}

		if (value.length > max) {
			return error;
		}

		return true;
	};

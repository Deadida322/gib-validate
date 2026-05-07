import { isEmptyValue } from './utils';

export const minLength =
	(min: number, error = 'value too short') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) {
			return true;
		}

		if (value.length < min) {
			return error;
		}

		return true;
	};

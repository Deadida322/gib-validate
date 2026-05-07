import { isEmptyValue } from './utils';

export const contains =
	(valueToFind: string, error = 'value must contain specified value') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) {
			return true;
		}

		if (!value.includes(String(valueToFind))) {
			return error;
		}
		return true;
	};

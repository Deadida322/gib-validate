export const contains =
	(valueToFind: string, error = 'value must contain specified value') =>
	(value: string): boolean | string => {
		if (!value.includes(String(valueToFind))) {
			return error;
		}
		return true;
	};

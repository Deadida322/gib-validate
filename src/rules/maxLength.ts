export const maxLength =
	(max: number, error = 'value too long') =>
	(value: string): boolean | string => {
		if (value.length > max) {
			return error;
		}

		return true;
	};

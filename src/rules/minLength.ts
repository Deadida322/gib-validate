export const minLength =
	(min: number, error = 'value too short') =>
	(value: string): boolean | string => {
		if (value.length < min) {
			return error;
		}

		return true;
	};

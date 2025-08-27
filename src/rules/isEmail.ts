export const isEmail =
	(error = 'invalid email') =>
	(value: string): boolean | string => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!value || value.length > 254 || !emailRegex.test(value)) {
			return error;
		}

		return true;
	};

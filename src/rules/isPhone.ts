export const isPhone =
	(error = 'invalid phone number') =>
	(value: string): boolean | string => {
		const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
		if (!value || !phoneRegex.test(value)) {
			return error;
		}
		return true;
	};

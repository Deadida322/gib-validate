export const isFutureDate =
	(error = 'date must be in the future') =>
	(value: string): boolean | string => {
		const now = new Date();
		const date = new Date(value);

		if (date <= now) return error;
		return true;
	};

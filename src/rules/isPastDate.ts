export const isPastDate =
	(error = 'date must be in the past') =>
	(value: string): boolean | string => {
		const now = new Date();
		const date = new Date(value);

		if (date >= now) return error;
		return true;
	};

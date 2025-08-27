export const isDate =
	(error = 'invalid date') =>
	(value: string): boolean | string => {
		const date = new Date(value);
		if (isNaN(date.getTime())) return error;
		return true;
	};

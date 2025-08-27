export const isNumeric =
	(error = 'value is not a number') =>
	(value: string): boolean | string => {
		if (isNaN(Number(value))) return error;
		return true;
	};

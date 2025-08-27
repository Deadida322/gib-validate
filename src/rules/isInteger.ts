export const isInteger =
	(error = 'value is not an integer') =>
	(value: string): boolean | string => {
		if (!Number.isInteger(Number(value))) return error;
		return true;
	};

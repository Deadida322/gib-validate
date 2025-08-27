export const oneOf =
	<T>(list: T[], error = 'invalid value') =>
	(value: T): boolean | string => {
		if (!list.includes(value)) return error;
		return true;
	};

export const fileType =
	(allowedTypes: string[], error = 'invalid file type') =>
	(value: File): boolean | string => {
		if (!allowedTypes.includes(value.type)) return error;
		return true;
	};

export const fileType =
	(allowedTypes: string[], error = 'invalid file type') =>
	(value: File | null | undefined): boolean | string => {
		if (!value) return true;
		if (!allowedTypes.includes(value.type)) return error;
		return true;
	};

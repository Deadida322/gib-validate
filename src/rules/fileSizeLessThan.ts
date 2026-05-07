export const fileSizeLessThan =
	(maxMB: number, error = `file size must be less than ${maxMB} MB`) =>
	(value: File | null | undefined): boolean | string => {
		if (!value) return true;
		if (value.size > maxMB * 1024 * 1024) return error;
		return true;
	};

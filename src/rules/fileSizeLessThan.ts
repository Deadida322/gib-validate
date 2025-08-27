export const fileSizeLessThan =
	(maxMB: number, error = `file size must be less than ${maxMB} MB`) =>
	(value: File): boolean | string => {
		if (value.size > maxMB * 1024 * 1024) return error;
		return true;
	};

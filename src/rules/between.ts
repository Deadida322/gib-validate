export const between =
	(min: number, max: number, error = `value must be between ${min} and ${max}`) =>
	(value: number): boolean | string => {
		if (value < min || value > max) return error;
		return true;
	};

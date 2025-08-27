export const isPassword =
	(
		minLen = 8,
		hasSpecialChar = true,
		error = `password must be at least ${minLen} chars and contain special characters`
	) =>
	(value: string): boolean | string => {
		if (value.length < minLen) return error;

		if (hasSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return error;

		return true;
	};

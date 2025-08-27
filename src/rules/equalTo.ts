export const equalTo =
	<T>(target: T, error = 'value must be equal to target') =>
	(value: T): boolean | string => {
		if (value !== target) return error;
		return true;
	};

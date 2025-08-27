import type { Validatable } from '@/types';

export const required =
	(error = 'value is required') =>
	(value: Validatable): string | boolean => {
		if (value === null || value === undefined) {
			return error;
		}

		if (typeof value === 'string' && value.trim() === '') {
			return error;
		}

		if (Array.isArray(value) && value.length === 0) {
			return error;
		}

		if (typeof value === 'object' && !Object.keys(value).length) {
			return error;
		}

		return true;
	};

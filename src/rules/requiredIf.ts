import type { Validatable } from '@/types';

export const requiredIf =
	(condition: () => boolean, error = 'field is required') =>
	(value: Validatable): boolean | string => {
		if (condition() && (!value || (typeof value === 'string' && value.trim() === ''))) {
			return error;
		}
		return true;
	};

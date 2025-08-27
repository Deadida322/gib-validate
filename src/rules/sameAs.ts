import type { Validatable } from '@/types';

export const sameAs =
	<T extends Validatable>(_equalTo: T, error = 'values do not match') =>
	(value: T): string | boolean => {
		if (value !== _equalTo) {
			return error;
		}
		return true;
	};

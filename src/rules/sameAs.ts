import type { Validatable } from '@/types';
import { isEmptyValue } from './utils';

export const sameAs =
	<T extends Validatable>(_equalTo: T, error = 'values do not match') =>
	(value: T | null | undefined): string | boolean => {
		if (isEmptyValue(value)) {
			return true;
		}

		if (value !== _equalTo) {
			return error;
		}
		return true;
	};

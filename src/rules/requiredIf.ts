import type { Validatable } from '@/types';
import { required } from './required';

export const requiredIf =
	(condition: () => boolean, error = 'field is required') =>
	(value: Validatable): boolean | string => {
		return condition() ? required(error)(value) : true;
	};

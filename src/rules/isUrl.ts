import { isEmptyValue } from './utils';

export const isUrl =
	(error = 'invalid url') =>
	(value: string | null | undefined): boolean | string => {
		if (isEmptyValue(value)) {
			return true;
		}

		const urlRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:[0-9]+)?(\/.*)?$/i;
		if (!urlRegex.test(value)) {
			return error;
		}
		return true;
	};

export const isUrl =
	(error = 'invalid url') =>
	(value: string): boolean | string => {
		const urlRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:[0-9]+)?(\/.*)?$/i;
		if (!value || !urlRegex.test(value)) {
			return error;
		}
		return true;
	};

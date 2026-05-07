export const isEmptyValue = (value: unknown): value is null | undefined | '' => {
	if (value === null || value === undefined) {
		return true;
	}

	if (typeof value === 'string' && value.trim() === '') {
		return true;
	}

	return false;
};

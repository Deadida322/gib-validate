import {
	between,
	contains,
	equalTo,
	fileSizeLessThan,
	fileType,
	isDate,
	isEmail,
	isFutureDate,
	isInteger,
	isNumeric,
	isPassword,
	isPastDate,
	isPhone,
	isUrl,
	maxLength,
	minLength,
	oneOf,
	sameAs
} from '../../src/rules';

describe('optional validation rules', () => {
	it('should accept empty values for non-required rules', () => {
		const emptyStringRules = [
			contains('a'),
			equalTo('a'),
			isDate(),
			isEmail(),
			isFutureDate(),
			isInteger(),
			isNumeric(),
			isPassword(),
			isPastDate(),
			isPhone(),
			isUrl(),
			maxLength(2),
			minLength(2),
			oneOf(['a']),
			sameAs('a')
		];

		emptyStringRules.forEach((rule) => {
			expect(rule('')).toBe(true);
		});

		expect(between(1, 2)(null)).toBe(true);
		expect(fileSizeLessThan(1)(null)).toBe(true);
		expect(fileType(['image/png'])(undefined)).toBe(true);
	});
});

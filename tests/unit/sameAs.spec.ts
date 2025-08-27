import { sameAs } from '../../src/rules';

describe('sameAs (Generic Test)', () => {
	const stringTarget = 'password123';
	const stringValidate = sameAs(stringTarget, 'Passwords do not match');

	const numberTarget = 123456;
	const numberValidate = sameAs(numberTarget, 'Numbers do not match');

	it('should accept equal string values', () => {
		expect(stringValidate(stringTarget)).toBe(true);
	});

	it('should reject unequal string values', () => {
		expect(stringValidate('wrongpass')).toBe('Passwords do not match');
	});

	it('should accept equal number values', () => {
		expect(numberValidate(numberTarget)).toBe(true);
	});

	it('should reject unequal number values', () => {
		expect(numberValidate(654321)).toBe('Numbers do not match');
	});

	it('should use default error message when none provided for strings', () => {
		const validateDefault = sameAs(stringTarget);
		expect(validateDefault('wrongpass')).toBe('values do not match');
	});

	it('should use default error message when none provided for numbers', () => {
		const validateDefault = sameAs(numberTarget);
		expect(validateDefault(654321)).toBe('values do not match');
	});
});

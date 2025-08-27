import { minLength } from './../../src/rules/minLength';

describe('minLength', () => {
	it('should return true for valid length', () => {
		expect(minLength(2, 'invalid length')('valid length')).toBe(true);
	});

	it('should return error message for invalid length', () => {
		expect(minLength(300, 'invalid length')('invalid length')).toBe('invalid length');
	});
	it('should return default error message for invalid length', () => {
		expect(minLength(30)('invalid length')).toBe('value too short');
	});
});

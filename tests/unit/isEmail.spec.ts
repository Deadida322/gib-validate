import { isEmail } from '../../src/rules/isEmail';

describe('isEmail', () => {
	it('should return true for valid email', () => {
		expect(isEmail('invalid email')('test@example.com')).toBe(true);
	});

	it('should return error message for invalid email', () => {
		expect(isEmail('invalid email')('test@com')).toBe('invalid email');
	});
	it('should return default error message for invalid email', () => {
		expect(isEmail()('test@com')).toBe('invalid email');
	});
});

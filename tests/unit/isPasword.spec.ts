import { isPassword } from '../../src/rules';

describe('isPassword', () => {
	const validate = isPassword(8, true, 'Invalid password');

	it('should accept strong password', () => {
		expect(validate('Str0ngP@ssw0rd')).toBe(true);
	});

	it('should reject short password', () => {
		expect(validate('Short1!')).toBe('Invalid password');
	});

	it('should reject missing special character', () => {
		expect(validate('Password123')).toBe('Invalid password');
	});
});

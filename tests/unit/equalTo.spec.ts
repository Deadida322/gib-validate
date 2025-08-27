// tests/validators/equalTo.spec.ts
import { equalTo } from '../../src/rules';

describe('equalTo', () => {
	const target = 'password123';
	const validate = equalTo(target, 'Passwords do not match');

	it('should accept equal values', () => {
		expect(validate(target)).toBe(true);
	});

	it('should reject unequal values', () => {
		expect(validate('wrongpass')).toBe('Passwords do not match');
	});
});

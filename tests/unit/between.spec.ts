// tests/validators/between.spec.ts
import { between } from '../../src/rules';

describe('between', () => {
	const validate = between(10, 20);

	it('should accept value within range', () => {
		expect(validate(15)).toBe(true);
	});

	it('should reject value below min', () => {
		expect(validate(5)).toBe('value must be between 10 and 20');
	});

	it('should reject value above max', () => {
		expect(validate(25)).toBe('value must be between 10 and 20');
	});
});

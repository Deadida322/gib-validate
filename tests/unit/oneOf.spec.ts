// tests/validators/oneOf.spec.ts
import { oneOf } from '../../src/rules';

describe('oneOf', () => {
	const allowedValues = ['red', 'green', 'blue'];
	const validate = oneOf(allowedValues, 'Must be one of the allowed values');

	it('should accept allowed value', () => {
		expect(validate('red')).toBe(true);
	});

	it('should reject disallowed value', () => {
		expect(validate('yellow')).toBe('Must be one of the allowed values');
	});
});

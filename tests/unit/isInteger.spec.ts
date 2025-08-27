// tests/validators/isInteger.spec.ts
import { isInteger } from '../../src/rules';

describe('isInteger', () => {
	it('should accept integer string', () => {
		expect(isInteger()('123')).toBe(true);
	});

	it('should reject float', () => {
		expect(isInteger()('123.45')).toBe('value is not an integer');
	});

	it('should reject non-numeric string', () => {
		expect(isInteger()('abc')).toBe('value is not an integer');
	});
});

// tests/validators/requiredIf.spec.ts
import { requiredIf } from '../../src/rules';

describe('requiredIf', () => {
	const condition = () => true;
	const validate = requiredIf(condition, 'Field is required');

	it('should require value if condition is true', () => {
		expect(validate('')).toBe('Field is required');
	});

	it('should pass if value provided', () => {
		expect(validate('value')).toBe(true);
	});

	it('should ignore if condition returns false', () => {
		const noRequired = requiredIf(() => false, 'Field is required');
		expect(noRequired('')).toBe(true);
	});
});

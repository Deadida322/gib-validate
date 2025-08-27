import { contains } from '../../src/rules';

describe('contains', () => {
	it('should work with string', () => {
		const validateString = contains('hello', 'Must contain "l"');
		expect(validateString('world')).toBe('Must contain "l"');
		expect(validateString('hello')).toBe(true);
	});
});

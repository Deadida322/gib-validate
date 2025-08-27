import { isNumeric } from '../../src/rules';

describe('isNumeric', () => {
	it('should accept numeric string', () => {
		expect(isNumeric()('123')).toBe(true);
	});

	it('should reject non-numeric string', () => {
		expect(isNumeric()('abc')).toBe('value is not a number');
	});

	it('should accept float numbers as strings', () => {
		expect(isNumeric()('123.45')).toBe(true);
	});
});

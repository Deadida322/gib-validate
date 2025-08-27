import { isDate } from '../../src/rules';

describe('isDate', () => {
	it('should accept valid date string', () => {
		expect(isDate()('2025-01-01')).toBe(true);
	});

	it('should reject invalid date', () => {
		expect(isDate()('invalid-date')).toBe('invalid date');
	});
});

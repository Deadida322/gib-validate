// tests/validators/isPastDate.spec.ts
import { isPastDate } from '../../src/rules';

describe('isPastDate', () => {
	const pastDate = new Date(Date.now() - 86400000).toISOString();
	const futureDate = new Date(Date.now() + 86400000).toISOString();

	it('should accept past date', () => {
		expect(isPastDate()(pastDate)).toBe(true);
	});

	it('should reject future date', () => {
		expect(isPastDate()(futureDate)).toBe('date must be in the past');
	});
});

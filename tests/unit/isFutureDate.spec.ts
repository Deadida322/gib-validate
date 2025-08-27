// tests/validators/isFutureDate.spec.ts
import { isFutureDate } from '../../src/rules';

describe('isFutureDate', () => {
	const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 день
	const pastDate = new Date(Date.now() - 86400000).toISOString();

	it('should accept future date', () => {
		expect(isFutureDate()(futureDate)).toBe(true);
	});

	it('should reject past date', () => {
		expect(isFutureDate()(pastDate)).toBe('date must be in the future');
	});
});

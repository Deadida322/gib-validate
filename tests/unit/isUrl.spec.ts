// tests/validators/isUrl.spec.ts
import { isUrl } from '../../src/rules';

describe('isUrl', () => {
	it('should accept valid URL', () => {
		expect(isUrl()('https://example.com')).toBe(true);
	});

	it('should reject invalid URL', () => {
		expect(isUrl()('not-a-url')).toBe('invalid url');
	});
});

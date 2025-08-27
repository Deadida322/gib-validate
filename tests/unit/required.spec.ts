import { required } from './../../src/rules/required';

describe('required', () => {
	it('should return true for required Array', () => {
		expect(required('value is required')(['value'])).toBe(true);
	});
	it('should return error message for required Array', () => {
		expect(required('value is required')([])).toBe('value is required');
	});
	it('should return true for required String', () => {
		expect(required('value is required')('String')).toBe(true);
	});
	it('should return error message for required String', () => {
		expect(required('value is required')('  ')).toBe('value is required');
	});
	it('should return true for required Number', () => {
		expect(required('value is required')(4)).toBe(true);
	});
	it('should return true for required Object', () => {
		expect(required('value is required')({ key: 1 })).toBe(true);
	});
	it('should return error message for required Object', () => {
		expect(required('value is required')({})).toBe('value is required');
	});
});

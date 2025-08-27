import { ValidationRules } from './../../src/types';
import { reactive, ref, computed } from 'vue';
import { nextTick } from 'vue';
import { useValidation } from '../../src/use/validation';
import { isEmail, minLength, required } from '../../src/rules';
import flushPromises from 'flush-promises';

type FormState = {
	email: string;
	password: string;
};

type FormRules = ValidationRules<FormState>;

describe('useValidation with reactive state', () => {
	let state: FormState;
	let rules: FormRules;

	beforeEach(() => {
		state = reactive<FormState>({
			email: '',
			password: ''
		});

		rules = {
			email: [isEmail()],
			password: [minLength(6)]
		};
	});
	it('should show errors after $touch', async () => {
		const validator = useValidation(state, rules);

		// Меняем поля
		state.email = 'bad-email';
		state.password = 'weak';

		await flushPromises();
		await nextTick();
		validator.value.$touch();

		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toContain('value too short');

		state.password = 'KindaH@rdPassword112';
		validator.value.$touch();
		await flushPromises();
		await nextTick();

		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toBeUndefined();
	});

	it('should not show error before touch', async () => {
		const validator = useValidation(state, rules);

		state.email = 'invalid';
		await flushPromises();
		await nextTick();

		expect(validator.value.$errors.email).toBeUndefined();

		validator.value.$touch();
		await flushPromises();
		await nextTick();

		expect(validator.value.$errors.email).toContain('invalid email');
	});
	
	it('should reset validation state for specific fields with $resetField', async () => {
		const validator = useValidation(state, rules);

		// Меняем поля
		state.email = 'bad-email';
		state.password = 'weak';

		await flushPromises();
		await nextTick();
		validator.value.$touch();

		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toContain('value too short');
		
		// Reset only the email field
		validator.value.$resetField('email');
		
		expect(validator.value.$errors.email).toBeUndefined();
		expect(validator.value.$errors.password).toContain('value too short');
		
		// Reset the password field as well
		validator.value.$resetField('password');
		
		expect(validator.value.$errors.email).toBeUndefined();
		expect(validator.value.$errors.password).toBeUndefined();
		
		// Test with array of fields
		validator.value.$touch();
		
		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toContain('value too short');
		
		validator.value.$resetField(['email', 'password']);
		
		expect(validator.value.$errors.email).toBeUndefined();
		expect(validator.value.$errors.password).toBeUndefined();
	});
	
	it('should work with dynamic rules via computed', async () => {
		const requiredCondition = ref(false);
		
		const dynamicRules = computed<ValidationRules<FormState>>(() => ({
			email: [isEmail()],
			password: requiredCondition.value ? [required(), minLength(6)] : [minLength(6)]
		}));
		
		const validator = useValidation(state, dynamicRules);
		
		// Initially password is not required
		state.password = '';
		await flushPromises();
		await nextTick();
		validator.value.$touch();
		
		expect(validator.value.$errors.password).toBeUndefined();
		
		// Make password required
		requiredCondition.value = true;
		await flushPromises();
		await nextTick();
		
		expect(validator.value.$errors.password).toContain('value is required');
		
		// Provide a valid password
		state.password = 'strongpass';
		await flushPromises();
		await nextTick();
		
		expect(validator.value.$errors.password).toBeUndefined();
	});
});
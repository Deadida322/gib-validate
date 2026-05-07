import { ValidationRules } from './../../src/types';
import { reactive, ref, computed, defineComponent, h, nextTick } from 'vue';
import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useNamedValidation, useValidation } from '../../src/use/validation';
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

	it('should work with state stored in a ref', async () => {
		const refState = ref<FormState>({
			email: '',
			password: ''
		});

		const validator = useValidation(refState, rules);

		refState.value.email = 'bad-email';
		refState.value.password = 'weak';

		await flushPromises();
		await nextTick();
		validator.value.$touch();

		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toContain('value too short');
	});

	it('should work with state provided by a getter', async () => {
		const refState = ref<FormState>({
			email: '',
			password: ''
		});

		const validator = useValidation(() => refState.value, rules);

		refState.value.email = 'bad-email';
		refState.value.password = 'weak';

		await flushPromises();
		await nextTick();
		validator.value.$touch();

		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toContain('value too short');
	});

	it('should validate the whole form and expose validity flags', async () => {
		const validator = useValidation(state, {
			email: [required(), isEmail()],
			password: [required(), minLength(6)]
		});

		state.email = 'bad-email';
		state.password = 'weak';

		const isValid = await validator.value.$validate();

		expect(isValid).toBe(false);
		expect(validator.value.$dirty).toBe(true);
		expect(validator.value.$invalid).toBe(true);
		expect(validator.value.$valid).toBe(false);
		expect(validator.value.$error).toBe(true);
		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toContain('value too short');
	});

	it('should validate one field', async () => {
		const validator = useValidation(state, rules);

		state.email = 'bad-email';
		state.password = 'weak';

		const isEmailValid = await validator.value.$validateField('email');

		expect(isEmailValid).toBe(false);
		expect(validator.value.$errors.email).toContain('invalid email');
		expect(validator.value.$errors.password).toBeUndefined();
	});

	it('should merge and clear external errors', async () => {
		const validator = useValidation(state, rules);

		validator.value.$setExternalErrors({
			email: ['email already exists']
		});
		validator.value.$touchField('email');

		expect(validator.value.$silentErrors.email).toContain('email already exists');
		expect(validator.value.$errors.email).toContain('email already exists');
		expect(validator.value.$invalid).toBe(true);

		validator.value.$clearExternalErrors('email');

		expect(validator.value.$silentErrors.email).toBeUndefined();
		expect(validator.value.$invalid).toBe(false);
	});

	it('should ignore outdated async validation results', async () => {
		vi.useFakeTimers();

		const validator = useValidation(state, {
			email: [
				async (value) => {
					await new Promise((resolve) => {
						setTimeout(resolve, value === 'bad-email' ? 20 : 1);
					});

					return value === 'bad-email' ? 'invalid async email' : true;
				}
			],
			password: []
		});

		state.email = 'bad-email';
		await nextTick();
		expect(validator.value.$pending).toBe(true);

		state.email = 'good@example.com';
		await nextTick();

		await vi.advanceTimersByTimeAsync(1);
		await flushPromises();

		expect(validator.value.$pending).toBe(false);
		expect(validator.value.$silentErrors.email).toBeUndefined();

		await vi.advanceTimersByTimeAsync(20);
		await flushPromises();

		expect(validator.value.$silentErrors.email).toBeUndefined();

		vi.useRealTimers();
	});

	it('should convert thrown rule errors into validation messages', async () => {
		const validator = useValidation(state, {
			email: [
				() => {
					throw new Error('rule failed');
				}
			],
			password: []
		});

		await validator.value.$validateField('email');

		expect(validator.value.$pending).toBe(false);
		expect(validator.value.$errors.email).toContain('rule failed');
	});

	it('should unregister named validation on component unmount', async () => {
		const namedValidation = useNamedValidation('mountedForm');
		const Component = defineComponent({
			setup() {
				const form = reactive({ email: '' });
				useValidation(form, { email: [required()] }, 'mountedForm');

				return () => h('div');
			}
		});

		const wrapper = mount(Component);

		expect(namedValidation.value).toBeDefined();

		wrapper.unmount();
		await nextTick();

		expect(namedValidation.value).toBeUndefined();
	});

	it('should remove nested validation from parent children on unmount', async () => {
		const Child = defineComponent({
			setup() {
				const address = reactive({ street: '' });
				useValidation(address, { street: [required()] }, 'address');

				return () => h('div');
			}
		});
		const Parent = defineComponent({
			setup(_, { expose }) {
				const showChild = ref(true);
				const form = reactive({ name: '' });
				const validator = useValidation(form, { name: [required()] });

				expose({ showChild, validator });

				return () => h('div', showChild.value ? [h(Child)] : []);
			}
		});

		const wrapper = mount(Parent);

		expect(wrapper.vm.validator.$children.address).toBeDefined();

		wrapper.vm.showChild = false;
		await nextTick();

		expect(wrapper.vm.validator.$children.address).toBeUndefined();
	});
});

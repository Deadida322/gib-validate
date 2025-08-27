<template>
	<div class="demo-container">
		<h2>Named Validation Demo</h2>

		<form
			class="form"
			@submit.prevent="submitForm">
			<!-- User Info Section -->
			<div class="form-section">
				<h3>User Information</h3>
				<div class="form-group">
					<label for="name">Name:</label>
					<input
						id="name"
						v-model="form.name"
						type="text"
						class="form-control"
						:class="{ 'is-invalid': userValidation.$errors.name }" />
					<span
						v-if="userValidation.$errors.name"
						class="error">
						{{ userValidation.$errors.name?.[0] }}
					</span>
				</div>

				<div class="form-group">
					<label for="email">Email:</label>
					<input
						id="email"
						v-model="form.email"
						type="email"
						class="form-control"
						:class="{ 'is-invalid': userValidation.$errors.email }" />
					<span
						v-if="userValidation.$errors.email"
						class="error">
						{{ userValidation.$errors.email?.[0] }}
					</span>
				</div>
			</div>

			<!-- Address Section (Child Component) -->
			<div class="form-section">
				<h3>Address Information</h3>
				<div class="form-group">
					<label for="street">Street:</label>
					<input
						id="street"
						v-model="form.address.street"
						type="text"
						class="form-control"
						:class="{ 'is-invalid': addressValidation.$errors.street }" />
					<span
						v-if="addressValidation.$errors.street"
						class="error">
						{{ addressValidation.$errors.street?.[0] }}
					</span>
				</div>

				<div class="form-group">
					<label for="city">City:</label>
					<input
						id="city"
						v-model="form.address.city"
						type="text"
						class="form-control"
						:class="{ 'is-invalid': addressValidation.$errors.city }" />
					<span
						v-if="addressValidation.$errors.city"
						class="error">
						{{ addressValidation.$errors.city?.[0] }}
					</span>
				</div>
			</div>

			<!-- Actions -->
			<div class="form-actions">
				<button
					type="submit"
					class="btn btn-primary">
					Submit
				</button>
				<button
					type="button"
					class="btn btn-secondary"
					@click="resetForm">
					Reset
				</button>
				<button
					type="button"
					class="btn btn-info"
					@click="validateAddress">
					Validate Address Only
				</button>
			</div>
		</form>

		<!-- Validation Status -->
		<div class="validation-status">
			<h3>Validation Status</h3>
			<p>User validation dirty: {{ userValidation.$dirty }}</p>
			<p>Address validation dirty: {{ addressValidation.$dirty }}</p>
			<p>Form is valid: {{ isFormValid }}</p>

			<h4>Named Validations Access</h4>
			<p>You can access validations by name from anywhere in your app:</p>
			<pre><code>// Get validations by name
const userVal = getValidation('userForm');
const addressVal = getValidation('addressForm');</code></pre>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, computed } from 'vue';
	import { useValidation, required, minLength, isEmail, getValidation } from 'gib-validate';

	// Form state
	const form = reactive({
		name: '',
		email: '',
		address: {
			street: '',
			city: ''
		}
	});

	// User validation rules
	const userRules = {
		name: [required('Name is required')],
		email: [required('Email is required'), isEmail('Please enter a valid email')]
	};

	// Create named user validation
	const userValidation = useValidation(form, userRules, 'userForm');

	// Address validation rules
	const addressRules = {
		street: [required('Street is required')],
		city: [
			required('City is required'),
			minLength(2, 'City name must be at least 2 characters')
		]
	};

	// Create named address validation (will be registered as child with this name)
	const addressValidation = useValidation(form.address, addressRules, 'addressForm');

	// Computed property to check if entire form is valid
	const isFormValid = computed(() => {
		return (
			userValidation.value.$errors &&
			Object.keys(userValidation.value.$errors).length === 0 &&
			addressValidation.value.$errors &&
			Object.keys(addressValidation.value.$errors).length === 0
		);
	});

	// Form methods
	function submitForm() {
		// Touch all validations to show errors
		userValidation.value.$touch();
		addressValidation.value.$touch();

		if (isFormValid.value) {
			console.log('Form submitted:', form);
			alert('Form is valid! Check console for submitted data.');
		} else {
			console.log('Form has errors');
		}
	}

	function resetForm() {
		// Reset all validations
		userValidation.value.$reset();
		addressValidation.value.$reset();

		// Reset form data
		form.name = '';
		form.email = '';
		form.address.street = '';
		form.address.city = '';
	}

	function validateAddress() {
		// Only validate address
		addressValidation.value.$touch();

		// We can also access it by name
		const namedAddressValidation = getValidation('addressForm');
		console.log('Address validation accessed by name:', namedAddressValidation);
	}
</script>

<style scoped>
	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.form {
		border: 1px solid rgb(226 232 240);
		border-radius: 0.5rem;
		background-color: rgb(255 255 255);
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 10%),
			0 2px 4px -1px rgb(0 0 0 / 6%);
	}

	.form-section {
		padding: 1.5rem;
		border-bottom: 1px solid rgb(237 242 247);
	}

	.form-section:last-child {
		border-bottom: none;
	}

	.form-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: rgb(74 85 104);
	}

	.form-group {
		margin-bottom: 1rem;
		text-align: left;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: rgb(74 85 104);
	}

	.form-control {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid rgb(203 213 224);
		border-radius: 0.25rem;

		font-size: 1rem;

		transition:
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
	}

	.form-control:focus {
		border-color: rgb(66 153 225);
		outline: none;
		box-shadow: 0 0 0 3px rgb(66 153 225 / 20%);
	}

	.form-control.is-invalid {
		border-color: rgb(229 62 62);
	}

	.error {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: rgb(229 62 62);
	}

	.form-actions {
		padding: 1.5rem;
		border-top: 1px solid rgb(237 242 247);
		text-align: center;
		background-color: rgb(247 250 252);
	}

	.btn {
		cursor: pointer;

		display: inline-block;

		margin: 0 0.25rem;
		padding: 0.5rem 1rem;
		border: 1px solid transparent;
		border-radius: 0.25rem;

		font-size: 1rem;
		font-weight: 600;
		line-height: 1.5;
		text-align: center;

		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
	}

	.btn-primary {
		border-color: rgb(66 153 225);
		color: rgb(255 255 255);
		background-color: rgb(66 153 225);
	}

	.btn-primary:hover {
		border-color: rgb(49 130 206);
		background-color: rgb(49 130 206);
	}

	.btn-secondary {
		border-color: rgb(226 232 240);
		color: rgb(45 55 72);
		background-color: rgb(226 232 240);
	}

	.btn-secondary:hover {
		border-color: rgb(203 213 224);
		background-color: rgb(203 213 224);
	}

	.btn-info {
		border-color: rgb(49 151 149);
		color: rgb(255 255 255);
		background-color: rgb(49 151 149);
	}

	.btn-info:hover {
		border-color: rgb(44 122 123);
		background-color: rgb(44 122 123);
	}

	.validation-status {
		margin-top: 2rem;
		padding: 1.5rem;
		border: 1px solid rgb(226 232 240);
		border-radius: 0.5rem;

		background-color: rgb(247 250 252);
	}

	.validation-status h3,
	.validation-status h4 {
		margin-top: 0;
	}

	.validation-status pre {
		overflow-x: auto;
		padding: 1rem;
		border-radius: 0.25rem;
		background-color: rgb(237 242 247);
	}
</style>

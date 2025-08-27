<template>
	<div class="form-components-demo">
		<h1>Form Components Demo</h1>

		<div class="component-section">
			<h2>Buttons</h2>
			<div class="button-group">
				<form-button variant="primary">Primary</form-button>
				<form-button variant="secondary">Secondary</form-button>
				<form-button variant="success">Success</form-button>
				<form-button variant="danger">Danger</form-button>
				<form-button variant="warning">Warning</form-button>
				<form-button variant="info">Info</form-button>
				<form-button variant="light">Light</form-button>
				<form-button variant="dark">Dark</form-button>
				<form-button variant="link">Link</form-button>
			</div>

			<div class="button-group">
				<form-button
					variant="primary"
					disabled
					>Disabled</form-button
				>
				<form-button
					variant="primary"
					block
					>Block Button</form-button
				>
			</div>
		</div>

		<div class="component-section">
			<h2>Form Inputs</h2>
			<form>
				<form-input
					id="name"
					v-model="form.name"
					label="Name"
					placeholder="Enter your name" />

				<form-input
					id="email"
					v-model="form.email"
					label="Email"
					type="email"
					placeholder="Enter your email"
					:error="emailError" />

				<form-input
					id="password"
					v-model="form.password"
					label="Password"
					type="password"
					placeholder="Enter your password"
					help-text="Password must be at least 8 characters long" />

				<form-input
					id="url"
					v-model="form.url"
					label="Website"
					type="url"
					placeholder="https://example.com"
					help-text="Please enter a valid URL" />

				<form-textarea
					id="message"
					v-model="form.message"
					label="Message"
					placeholder="Enter your message"
					:rows="4" />

				<form-select
					id="country"
					v-model="form.country"
					label="Country"
					:options="countries"
					placeholder="Select your country" />

				<div class="form-row">
					<form-checkbox
						id="newsletter"
						v-model="form.newsletter">
						Subscribe to newsletter
					</form-checkbox>
				</div>

				<div class="form-row">
					<label class="radio-group-label">Gender</label>
					<div class="radio-group">
						<form-radio
							id="male"
							v-model="form.gender"
							name="gender"
							value="male">
							Male
						</form-radio>
						<form-radio
							id="female"
							v-model="form.gender"
							name="gender"
							value="female">
							Female
						</form-radio>
						<form-radio
							id="other"
							v-model="form.gender"
							name="gender"
							value="other">
							Other
						</form-radio>
					</div>
				</div>

				<div class="form-row">
					<form-button
						type="submit"
						variant="primary"
						>Submit</form-button
					>
					<form-button
						type="button"
						variant="secondary"
						>Cancel</form-button
					>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import FormButton from './FormComponents/FormButton.vue';
	import FormInput from './FormComponents/FormInput.vue';
	import FormTextarea from './FormComponents/FormTextarea.vue';
	import FormSelect from './FormComponents/FormSelect.vue';
	import FormCheckbox from './FormComponents/FormCheckbox.vue';
	import FormRadio from './FormComponents/FormRadio.vue';

	const form = ref({
		name: '',
		email: '',
		password: '',
		url: '',
		message: '',
		country: '',
		newsletter: false,
		gender: ''
	});

	const countries = [
		{ value: 'us', text: 'United States' },
		{ value: 'uk', text: 'United Kingdom' },
		{ value: 'ca', text: 'Canada' },
		{ value: 'au', text: 'Australia' },
		{ value: 'de', text: 'Germany' },
		{ value: 'fr', text: 'France' }
	];

	const emailError = computed(() => {
		if (form.value.email && !form.value.email.includes('@')) {
			return 'Please enter a valid email address';
		}
		return '';
	});
</script>

<style scoped>
	.form-components-demo {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin-bottom: 2rem;
		text-align: center;
	}

	.component-section {
		margin-bottom: 3rem;
		padding: 1.5rem;
		border: 1px solid rgb(226 232 240);
		border-radius: 0.5rem;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.form-row {
		margin-bottom: 1rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.radio-group-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: rgb(74 85 104);
	}

	.radio-group {
		display: flex;
		gap: 1rem;
	}
</style>

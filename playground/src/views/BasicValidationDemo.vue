<script setup lang="ts">
	import { computed, reactive } from 'vue';
	import { isEmail, isPassword, minLength, required, useValidation } from 'gib-validate';

	const form = reactive({
		email: '',
		password: '',
		confirmPassword: ''
	});

	const rules = {
		email: [required('Email is required'), isEmail('Enter a valid email')],
		password: [
			required('Password is required'),
			minLength(8, 'Use at least 8 characters'),
			isPassword(8, true, 'Add a special character')
		],
		confirmPassword: [
			required('Repeat the password'),
			(value: string, state: typeof form) =>
				value === state.password || 'Passwords do not match'
		]
	};

	const v = useValidation(form, rules, 'basicForm');
	const status = computed(() => (v.value.$valid ? 'Valid' : 'Invalid'));

	async function submit() {
		await v.value.$validate();
	}
</script>

<template>
	<section class="page">
		<div class="heading">
			<h1>Basic Form</h1>
			<span :class="['status', v.$valid ? 'status-valid' : 'status-invalid']">
				{{ status }}
			</span>
		</div>

		<form
			class="panel"
			@submit.prevent="submit">
			<label>
				<span>Email</span>
				<input
					v-model="form.email"
					type="email"
					@blur="v.$touchField('email')"
					@input="v.$clearExternalErrors('email')" />
				<small>{{ v.$message.email }}</small>
			</label>

			<label>
				<span>Password</span>
				<input
					v-model="form.password"
					type="password"
					@blur="v.$touchField('password')" />
				<small>{{ v.$message.password }}</small>
			</label>

			<label>
				<span>Confirm password</span>
				<input
					v-model="form.confirmPassword"
					type="password"
					@blur="v.$touchField('confirmPassword')" />
				<small>{{ v.$message.confirmPassword }}</small>
			</label>

			<div class="actions">
				<button type="submit">Validate</button>
				<button
					type="button"
					@click="v.$reset()">
					Reset
				</button>
			</div>
		</form>

		<div class="state-grid">
			<div>
				<strong>$dirty</strong>
				<span>{{ v.$dirty }}</span>
			</div>
			<div>
				<strong>$error</strong>
				<span>{{ v.$error }}</span>
			</div>
			<div>
				<strong>$pending</strong>
				<span>{{ v.$pending }}</span>
			</div>
			<div>
				<strong>$silentInvalid</strong>
				<span>{{ v.$silentInvalid }}</span>
			</div>
		</div>
	</section>
</template>

<style scoped>
	.page {
		display: grid;
		gap: 20px;
	}

	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	h1 {
		margin: 0;
		font-size: 28px;
	}

	.status {
		padding: 6px 10px;
		border-radius: 6px;
		font-weight: 700;
	}

	.status-valid {
		color: rgb(22 101 52);
		background: rgb(220 252 231);
	}

	.status-invalid {
		color: rgb(153 27 27);
		background: rgb(254 226 226);
	}

	.panel {
		display: grid;
		gap: 16px;

		padding: 20px;
		border: 1px solid rgb(226 232 240);
		border-radius: 8px;

		background: white;
	}

	label {
		display: grid;
		gap: 6px;
	}

	label span {
		font-weight: 700;
	}

	input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid rgb(203 213 225);
		border-radius: 6px;
	}

	small {
		min-height: 18px;
		color: rgb(185 28 28);
	}

	.actions {
		display: flex;
		gap: 10px;
	}

	button {
		cursor: pointer;

		padding: 10px 14px;
		border: 1px solid rgb(22 163 74);
		border-radius: 6px;

		color: white;

		background: rgb(22 163 74);
	}

	button[type='button'] {
		color: rgb(22 101 52);
		background: white;
	}

	.state-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.state-grid div {
		display: grid;
		gap: 4px;

		padding: 14px;
		border: 1px solid rgb(226 232 240);
		border-radius: 8px;

		background: white;
	}

	@media (width <= 760px) {
		.state-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>

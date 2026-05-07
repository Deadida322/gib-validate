<script setup lang="ts">
	import { reactive, ref } from 'vue';
	import { between, isEmail, isUrl, minLength, required, useValidation } from 'gib-validate';

	const account = reactive({
		email: '',
		username: 'taken',
		password: '',
		confirmPassword: ''
	});

	const profileStore = reactive({
		profile: {
			website: '',
			age: null as number | null
		}
	});

	const usernameRule = async (value: string) => {
		await new Promise((resolve) => {
			setTimeout(resolve, 650);
		});

		return value.toLowerCase() === 'taken' ? 'Username is already taken' : true;
	};

	const accountRules = {
		email: [required('Email is required'), isEmail()],
		username: [required('Username is required'), minLength(3), usernameRule],
		password: [required('Password is required'), minLength(8)],
		confirmPassword: [
			(value: string, state: typeof account) =>
				value === state.password || 'Passwords do not match'
		]
	};

	const profileRules = {
		website: [isUrl()],
		age: [between(18, 99, 'Age must be 18-99')]
	};

	const accountValidation = useValidation(account, accountRules, 'advancedAccount');
	const profileValidation = useValidation(() => profileStore.profile, profileRules);
	const serverMessage = ref('');

	async function submitAccount() {
		serverMessage.value = '';

		if (!(await accountValidation.value.$validate())) return;

		if (account.email.endsWith('@example.com')) {
			accountValidation.value.$setExternalErrors({
				email: ['Server rejected this email domain']
			});
			serverMessage.value = 'Server returned field errors';
			return;
		}

		serverMessage.value = 'Account accepted';
	}

	async function validateProfile() {
		await profileValidation.value.$validate();
	}
</script>

<template>
	<section class="page">
		<div class="heading">
			<h1>Advanced API</h1>
			<div class="badges">
				<span :class="['badge', accountValidation.$pending && 'badge-live']">
					pending: {{ accountValidation.$pending }}
				</span>
				<span :class="['badge', accountValidation.$valid && 'badge-ok']">
					valid: {{ accountValidation.$valid }}
				</span>
			</div>
		</div>

		<div class="layout">
			<form
				class="panel"
				@submit.prevent="submitAccount">
				<h2>Account</h2>

				<label>
					<span>Email</span>
					<input
						v-model="account.email"
						type="email"
						@blur="accountValidation.$touchField('email')"
						@input="accountValidation.$clearExternalErrors('email')" />
					<small>{{ accountValidation.$message.email }}</small>
				</label>

				<label>
					<span>Username</span>
					<input
						v-model="account.username"
						@blur="accountValidation.$validateField('username')" />
					<small>{{ accountValidation.$message.username }}</small>
				</label>

				<label>
					<span>Password</span>
					<input
						v-model="account.password"
						type="password"
						@blur="accountValidation.$touchField('password')" />
					<small>{{ accountValidation.$message.password }}</small>
				</label>

				<label>
					<span>Confirm password</span>
					<input
						v-model="account.confirmPassword"
						type="password"
						@blur="accountValidation.$touchField('confirmPassword')" />
					<small>{{ accountValidation.$message.confirmPassword }}</small>
				</label>

				<div class="actions">
					<button
						type="submit"
						:disabled="accountValidation.$pending">
						Submit
					</button>
					<button
						type="button"
						@click="accountValidation.$reset()">
						Reset
					</button>
				</div>

				<p class="server">{{ serverMessage }}</p>
			</form>

			<form
				class="panel"
				@submit.prevent="validateProfile">
				<h2>Profile Store</h2>

				<label>
					<span>Website</span>
					<input
						v-model="profileStore.profile.website"
						placeholder="https://example.com"
						@blur="profileValidation.$touchField('website')" />
					<small>{{ profileValidation.$message.website }}</small>
				</label>

				<label>
					<span>Age</span>
					<input
						v-model.number="profileStore.profile.age"
						type="number"
						@blur="profileValidation.$touchField('age')" />
					<small>{{ profileValidation.$message.age }}</small>
				</label>

				<div class="actions">
					<button type="submit">Validate</button>
					<button
						type="button"
						@click="profileValidation.$resetValidation()">
						Reset validation
					</button>
				</div>
			</form>
		</div>

		<div class="state-grid">
			<div>
				<strong>Account errors</strong>
				<pre>{{ accountValidation.$silentErrors }}</pre>
			</div>
			<div>
				<strong>Profile errors</strong>
				<pre>{{ profileValidation.$silentErrors }}</pre>
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
		gap: 16px;
		align-items: center;
		justify-content: space-between;
	}

	h1,
	h2 {
		margin: 0;
	}

	h1 {
		font-size: 28px;
	}

	h2 {
		font-size: 18px;
	}

	.badges,
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.badge {
		padding: 6px 10px;
		border-radius: 6px;

		font-weight: 700;
		color: rgb(71 85 105);

		background: rgb(241 245 249);
	}

	.badge-live {
		color: rgb(146 64 14);
		background: rgb(254 243 199);
	}

	.badge-ok {
		color: rgb(22 101 52);
		background: rgb(220 252 231);
	}

	.layout,
	.state-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.panel,
	.state-grid div {
		display: grid;
		gap: 14px;

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

	button {
		cursor: pointer;

		padding: 10px 14px;
		border: 1px solid rgb(22 163 74);
		border-radius: 6px;

		color: white;

		background: rgb(22 163 74);
	}

	button:disabled {
		cursor: wait;
		opacity: 0.62;
	}

	button[type='button'] {
		color: rgb(22 101 52);
		background: white;
	}

	.server {
		min-height: 20px;
		margin: 0;
		font-weight: 700;
		color: rgb(15 118 110);
	}

	pre {
		overflow: auto;

		margin: 0;
		padding: 12px;
		border-radius: 6px;

		color: rgb(226 232 240);

		background: rgb(15 23 42);
	}

	@media (width <= 860px) {
		.heading {
			flex-direction: column;
			align-items: flex-start;
		}

		.layout,
		.state-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

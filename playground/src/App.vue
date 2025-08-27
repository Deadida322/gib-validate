<script setup lang="ts">
	import {
		useValidation,
		required,
		isEmail,
		minLength,
		isPassword,
		useNamedValidation,
		sameAs,
		type ValidationRules
	} from 'gib-validate';
	import { reactive, computed } from 'vue';
	import FormInput from './components/FormComponents/FormInput.vue';
	import NestedForm from './components/NestedForm.vue';
	import FormButton from './components/FormComponents/FormButton.vue';
	import JsonViewer from 'vue-json-viewer';
	const form = reactive({
		email: '',
		password: '',
		repassword: ''
	});

	const rules = computed(() => ({
		email: [required(), isEmail()],
		password: [required(), minLength(6), isPassword(8)],
		repassword: [required(), sameAs(form.password)]
	})) as ValidationRules<typeof form>;

	const v = useValidation(form, rules, 'parent');

	const nested = useNamedValidation('nested');
</script>

<template>
	<div class="root">
		<form
			class="form"
			@submit.prevent="v.$touch()">
			<h2>Родительская валидация</h2>
			<div class="form-group">
				<form-input
					id="email"
					v-model="form.email"
					label="email"
					:error="v.$message.email"
					type="email"
					@input="v.$resetField('email')"
					@blur="v.$touchField('email')" />
			</div>
			<div class="form-group">
				<form-input
					v-model="form.password"
					label="Password"
					:error="v.$message.password"
					type="password" />
				<form-input
					v-model="form.repassword"
					label="Repeat password"
					:error="v.$message.repassword"
					type="password" />
			</div>
			<form class="form">
				<nested-form />
			</form>
			<form-button
				type="submit"
				class="btn btn-primary">
				Submit
			</form-button>
			<h6>Стейт родительский</h6>
			<json-viewer
				class="json"
				:value="v" />
			<h6>Стейт вложенный</h6>
			<json-viewer
				class="json"
				:value="nested" />
		</form>
	</div>
</template>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: rgb(44 62 80);
		text-align: center;
	}

	* {
		box-sizing: border-box;
	}

	/* Basic form styles */
	.form {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid rgb(226 232 240);
		border-radius: 0.5rem;

		background-color: rgb(255 255 255);
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 10%),
			0 2px 4px -1px rgb(0 0 0 / 6%);
	}

	.json {
		text-align: left;
	}
</style>

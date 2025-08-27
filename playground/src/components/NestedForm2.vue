<script setup lang="ts">
	import { isEmail, minLength, required, useValidation } from 'gib-validate';
	import FormInput from './FormComponents/FormInput.vue';
	import { reactive } from 'vue';

	const form = reactive({
		email: '',
		password: ''
	});
	const v = useValidation(
		form,
		{
			email: [required(), isEmail()],
			password: [required(), minLength(6)]
		},
		'nested2'
	);
</script>

<template>
	<div>
		<h2>Вложенная форма 2</h2>
		<form-input
			id="email"
			v-model="form.email"
			label="Email"
			:error="v.$errors.email?.[0]"
			type="email"
			@input="v.$resetField('email')"
			@blur="v.$touchField('email')" />
		<form-input
			id="password"
			v-model="form.password"
			label="Password"
			:error="v.$errors.password?.[0]"
			type="password"
			@input="v.$resetField('password')"
			@blur="v.$touchField('password')" />
	</div>
</template>

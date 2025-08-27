<script setup lang="ts">
	import { isEmail, minLength, required, useNamedValidation, useValidation } from 'gib-validate';
	import FormInput from './FormComponents/FormInput.vue';
	import JsonViewer from 'vue-json-viewer';
	import { reactive } from 'vue';
	import NestedForm2 from './NestedForm2.vue';
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
		'nested'
	);

	const v2 = useNamedValidation('parent');
</script>

<template>
	<div>
		<h2>Вложенная форма</h2>
		<form-input
			id="email"
			v-model="form.email"
			label="Email"
			:error="v.$message.password"
			type="email"
			@input="v.$resetField('email')"
			@blur="v.$touchField('email')" />
		<form-input
			id="password"
			v-model="form.password"
			label="Password"
			:error="v.$message.password"
			type="password"
			@input="v.$resetField('password')"
			@blur="v.$touchField('password')" />
	</div>
	<h6>Родительский стейт из вложенного</h6>
	<json-viewer
		class="json"
		:value="v2" />
	<nested-form2></nested-form2>
</template>

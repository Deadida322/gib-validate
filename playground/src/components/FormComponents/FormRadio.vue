<template>
	<div class="form-check">
		<input
			:id="id"
			:checked="isChecked"
			class="form-check-input"
			type="radio"
			:name="name"
			:value="value"
			:disabled="disabled"
			@change="handleChange" />
		<label
			:for="id"
			class="form-check-label">
			<slot />
		</label>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	interface Props {
		modelValue?: string | number | boolean;
		id?: string;
		name?: string;
		value?: string | number | boolean;
		disabled?: boolean;
	}

	interface Emits {
		(e: 'update:modelValue', value: string | number | boolean): void;
		(e: 'change'): void;
	}

	const props = withDefaults(defineProps<Props>(), {
		disabled: false
	});

	const emit = defineEmits<Emits>();

	const isChecked = computed(() => {
		return props.modelValue === props.value;
	});

	function handleChange() {
		emit('update:modelValue', props.value!);
		emit('change');
	}
</script>

<style scoped>
	.form-check {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.form-check-input {
		width: 1rem;
		height: 1rem;
		margin-top: 0.25rem;
		margin-right: 0.5rem;
		border: 1px solid rgb(203 213 224);

		&:focus {
			border-color: rgb(66 153 225);
			outline: 0;
			box-shadow: 0 0 0 0.25rem rgb(66 153 225 / 25%);
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 1;
			background-color: rgb(248 249 250);
		}
	}

	.form-check-label {
		margin-bottom: 0;
		color: rgb(74 85 104);
	}
</style>

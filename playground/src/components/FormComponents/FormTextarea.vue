<template>
	<div class="form-group">
		<label
			v-if="label"
			:for="id"
			class="form-label">
			{{ label }}
		</label>
		<textarea
			:id="id"
			v-model="modelValue"
			:class="['form-control', { 'form-control-error': error }]"
			:placeholder="placeholder"
			:disabled="disabled"
			:rows="rows"
			@blur="handleBlur"
			@input="handleInput" />
		<div
			v-if="error"
			class="form-error">
			{{ error }}
		</div>
		<div
			v-else-if="helpText"
			class="form-help">
			{{ helpText }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	interface Props {
		modelValue?: string;
		label?: string;
		id?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: string;
		helpText?: string;
		rows?: number | string;
	}

	interface Emits {
		(e: 'update:modelValue', value: string): void;
		(e: 'blur'): void;
		(e: 'input'): void;
	}

	const props = withDefaults(defineProps<Props>(), {
		modelValue: '',
		placeholder: '',
		disabled: false,
		rows: 3
	});

	const emit = defineEmits<Emits>();

	const modelValue = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		}
	});

	function handleBlur() {
		emit('blur');
	}

	function handleInput() {
		emit('input');
	}
</script>

<style scoped>
	.form-group {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: rgb(74 85 104);
	}

	.form-control {
		display: block;

		width: 100%;
		padding: 0.375rem 0.75rem;
		border: 1px solid rgb(203 213 224);
		border-radius: 0.25rem;

		font-size: 1rem;
		line-height: 1.5;

		transition:
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;

		&:focus {
			border-color: rgb(66 153 225);
			outline: 0;
			box-shadow: 0 0 0 0.25rem rgb(66 153 225 / 25%);
		}

		&.form-control-error {
			border-color: rgb(220 53 69);

			&:focus {
				border-color: rgb(220 53 69);
				box-shadow: 0 0 0 0.25rem rgb(220 53 69 / 25%);
			}
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 1;
			background-color: rgb(248 249 250);
		}
	}

	.form-error {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: rgb(220 53 69);
	}

	.form-help {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: rgb(108 117 125);
	}
</style>

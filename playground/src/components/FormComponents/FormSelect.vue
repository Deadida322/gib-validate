<template>
	<div class="form-group">
		<label
			v-if="label"
			:for="id"
			class="form-label">
			{{ label }}
		</label>
		<select
			:id="id"
			v-model="modelValue"
			:class="['form-control', { 'form-control-error': error }]"
			:disabled="disabled"
			@blur="handleBlur"
			@change="handleChange">
			<option
				v-if="placeholder"
				value=""
				disabled
				selected>
				{{ placeholder }}
			</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value">
				{{ option.text }}
			</option>
		</select>
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

	interface Option {
		value: string | number;
		text: string;
	}

	interface Props {
		modelValue?: string | number;
		label?: string;
		id?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: string;
		helpText?: string;
		options?: Option[];
	}

	interface Emits {
		(e: 'update:modelValue', value: string | number): void;
		(e: 'blur'): void;
		(e: 'change'): void;
	}

	const props = withDefaults(defineProps<Props>(), {
		modelValue: '',
		placeholder: '',
		disabled: false,
		options: () => []
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

	function handleChange() {
		emit('change');
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

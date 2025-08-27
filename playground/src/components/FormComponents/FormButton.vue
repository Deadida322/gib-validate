<template>
	<button
		:class="['btn', `btn-${variant}`, { 'btn-disabled': disabled, 'btn-block': block }]"
		:disabled="disabled"
		:type="type">
		<slot />
	</button>
</template>

<script setup lang="ts">
	interface Props {
		variant?:
			| 'primary'
			| 'secondary'
			| 'success'
			| 'danger'
			| 'warning'
			| 'info'
			| 'light'
			| 'dark'
			| 'link';
		disabled?: boolean;
		block?: boolean;
		type?: 'button' | 'submit' | 'reset';
	}

	withDefaults(defineProps<Props>(), {
		variant: 'primary',
		disabled: false,
		block: false,
		type: 'button'
	});
</script>

<style scoped>
	.btn {
		cursor: pointer;

		display: inline-block;

		padding: 0.375rem 0.75rem;
		border: 1px solid transparent;
		border-radius: 0.25rem;

		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		text-align: center;
		text-decoration: none;
		vertical-align: middle;

		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;

		&:focus {
			outline: 0;
		}

		&:disabled,
		&.btn-disabled {
			cursor: not-allowed;
			opacity: 0.65;
		}

		&.btn-block {
			display: block;
			width: 100%;
		}
	}

	/* Variant styles */
	.btn-primary {
		border-color: rgb(66 153 225);
		color: rgb(255 255 255);
		background-color: rgb(66 153 225);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(49 130 206);
			background-color: rgb(49 130 206);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(66 153 225 / 25%);
		}
	}

	.btn-secondary {
		border-color: rgb(158 158 158);
		color: rgb(255 255 255);
		background-color: rgb(158 158 158);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(135 135 135);
			background-color: rgb(135 135 135);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(158 158 158 / 25%);
		}
	}

	.btn-success {
		border-color: rgb(72 180 97);
		color: rgb(255 255 255);
		background-color: rgb(72 180 97);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(61 153 83);
			background-color: rgb(61 153 83);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(72 180 97 / 25%);
		}
	}

	.btn-danger {
		border-color: rgb(220 53 69);
		color: rgb(255 255 255);
		background-color: rgb(220 53 69);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(187 45 59);
			background-color: rgb(187 45 59);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(220 53 69 / 25%);
		}
	}

	.btn-warning {
		border-color: rgb(255 193 7);
		color: rgb(0 0 0);
		background-color: rgb(255 193 7);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(217 164 6);
			background-color: rgb(217 164 6);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(255 193 7 / 25%);
		}
	}

	.btn-info {
		border-color: rgb(23 162 184);
		color: rgb(255 255 255);
		background-color: rgb(23 162 184);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(20 138 156);
			background-color: rgb(20 138 156);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(23 162 184 / 25%);
		}
	}

	.btn-light {
		border-color: rgb(248 249 250);
		color: rgb(0 0 0);
		background-color: rgb(248 249 250);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(211 212 213);
			background-color: rgb(211 212 213);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(248 249 250 / 25%);
		}
	}

	.btn-dark {
		border-color: rgb(52 58 64);
		color: rgb(255 255 255);
		background-color: rgb(52 58 64);

		&:hover:not(:disabled, .btn-disabled) {
			border-color: rgb(44 49 54);
			background-color: rgb(44 49 54);
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(52 58 64 / 25%);
		}
	}

	.btn-link {
		border-color: transparent;
		color: rgb(66 153 225);
		background-color: transparent;

		&:hover:not(:disabled, .btn-disabled) {
			border-color: transparent;
			color: rgb(49 130 206);
			background-color: transparent;
		}

		&:focus:not(:disabled, .btn-disabled) {
			box-shadow: 0 0 0 0.25rem rgb(66 153 225 / 25%);
		}
	}
</style>

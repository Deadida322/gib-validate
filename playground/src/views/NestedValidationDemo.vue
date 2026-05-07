<script setup lang="ts">
	import { computed, defineComponent, h, reactive, ref } from 'vue';
	import { minLength, required, useNamedValidation, useValidation } from 'gib-validate';

	const AddressForm = defineComponent({
		name: 'AddressForm',
		setup() {
			const address = reactive({
				street: '',
				city: ''
			});

			const v = useValidation(
				address,
				{
					street: [required('Street is required')],
					city: [required('City is required'), minLength(2)]
				},
				'address'
			);

			return () =>
				h('div', { class: 'child-panel' }, [
					h('label', [
						h('span', 'Street'),
						h('input', {
							value: address.street,
							onInput: (event: Event) => {
								address.street = (event.target as HTMLInputElement).value;
							},
							onBlur: () => v.value.$touchField('street')
						}),
						h('small', v.value.$message.street ?? '')
					]),
					h('label', [
						h('span', 'City'),
						h('input', {
							value: address.city,
							onInput: (event: Event) => {
								address.city = (event.target as HTMLInputElement).value;
							},
							onBlur: () => v.value.$touchField('city')
						}),
						h('small', v.value.$message.city ?? '')
					])
				]);
		}
	});

	const form = reactive({
		name: ''
	});
	const showAddress = ref(true);
	const parentValidation = useValidation(form, {
		name: [required('Name is required')]
	});
	const addressValidation = useNamedValidation('address');
	const addressErrors = computed(() => addressValidation.value?.$silentErrors);
	const childCount = computed(() => Object.keys(parentValidation.value.$children).length);

	async function submit() {
		await parentValidation.value.$validate();
	}
</script>

<template>
	<section class="page">
		<div class="heading">
			<h1>Nested Validation</h1>
			<span class="badge">children: {{ childCount }}</span>
		</div>

		<form
			class="panel"
			@submit.prevent="submit">
			<label>
				<span>Name</span>
				<input
					v-model="form.name"
					@blur="parentValidation.$touchField('name')" />
				<small>{{ parentValidation.$message.name }}</small>
			</label>

			<address-form v-if="showAddress" />

			<div class="actions">
				<button type="submit">Validate all</button>
				<button
					type="button"
					@click="parentValidation.$reset()">
					Reset all
				</button>
				<button
					type="button"
					@click="showAddress = !showAddress">
					{{ showAddress ? 'Unmount address' : 'Mount address' }}
				</button>
			</div>
		</form>

		<div class="state-grid">
			<div>
				<strong>Parent</strong>
				<pre>{{ parentValidation.$silentErrors }}</pre>
			</div>
			<div>
				<strong>Address</strong>
				<pre>{{ addressErrors }}</pre>
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

	.badge {
		padding: 6px 10px;
		border-radius: 6px;

		font-weight: 700;
		color: rgb(22 101 52);

		background: rgb(220 252 231);
	}

	.panel,
	.state-grid div,
	:deep(.child-panel) {
		display: grid;
		gap: 14px;

		padding: 20px;
		border: 1px solid rgb(226 232 240);
		border-radius: 8px;

		background: white;
	}

	:deep(.child-panel) {
		background: rgb(248 250 252);
	}

	label,
	:deep(label) {
		display: grid;
		gap: 6px;
	}

	label span,
	:deep(label span) {
		font-weight: 700;
	}

	input,
	:deep(input) {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid rgb(203 213 225);
		border-radius: 6px;
	}

	small,
	:deep(small) {
		min-height: 18px;
		color: rgb(185 28 28);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
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
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	pre {
		overflow: auto;

		margin: 0;
		padding: 12px;
		border-radius: 6px;

		color: rgb(226 232 240);

		background: rgb(15 23 42);
	}

	@media (width <= 760px) {
		.heading {
			flex-direction: column;
			gap: 12px;
			align-items: flex-start;
		}

		.state-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

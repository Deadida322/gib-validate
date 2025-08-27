import { createRouter, createWebHistory } from 'vue-router';
import PlaygroundPage from './components/PlaygroundPage.vue';
import PlaygroundForm from './components/Playground/Form.vue';
import PlaygroundNested from './components/Playground/Nested.vue';
import NamedValidationDemo from './components/NamedValidationDemo.vue';
import FormComponentsDemo from './components/FormComponentsDemo.vue';

const routes = [
	{
		path: '/',
		name: 'home',
		component: PlaygroundPage
	},
	{
		path: '/playground/form',
		name: 'form',
		component: PlaygroundForm
	},
	{
		path: '/playground/nested',
		name: 'nested',
		component: PlaygroundNested
	},
	{
		path: '/playground/named',
		name: 'named',
		component: NamedValidationDemo
	},
	{
		path: '/playground/components',
		name: 'components',
		component: FormComponentsDemo
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import PlaygroundPage from './components/PlaygroundPage.vue';
import PlaygroundForm from './views/BasicValidationDemo.vue';
import PlaygroundAdvanced from './views/AdvancedValidationDemo.vue';
import PlaygroundNested from './views/NestedValidationDemo.vue';
import NamedValidationDemo from './components/NamedValidationDemo.vue';

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
		path: '/playground/advanced',
		name: 'advanced',
		component: PlaygroundAdvanced
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
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;

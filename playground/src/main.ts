import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
import 'floating-vue/dist/style.css';

app.use(router);
app.mount('#app');

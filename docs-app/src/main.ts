import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// @ts-ignore: Importing CSS for side effects
import './assets/main.css';
import { createI18n, I18N_KEY } from './i18n';

const app = createApp(App);
app.use(router);

const i18n = createI18n();
app.provide(I18N_KEY, i18n);

app.mount('#app');

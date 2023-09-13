import { useFetch } from '@vueuse/core';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { makeServer } from './support/utils/server';
import money from 'v-money3';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@/assets/css/global.scss';

if (!import.meta.env.PROD) {
  makeServer({ environment: 'development' });
}

const pinia = createPinia();
export const app = createApp(App);

app.use(money);
app.use(pinia);
app.use(PrimeVue, {
  zIndex: {
    modal: 1100, //dialog, sidebar
    overlay: 1000, //dropdown, overlaypanel
    menu: 1000, //overlay menus
    tooltip: 1100, //tooltip
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app');

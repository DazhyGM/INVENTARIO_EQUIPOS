import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import router from './router/index';

createApp(App).mount('#app')
createApp(App).use(router).mount('#app');

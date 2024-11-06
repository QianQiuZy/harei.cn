/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// css
import '@/styles/global.sass'
import "animate.css/animate.min.css";
import "vue3-photo-preview/dist/index.css";
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'vue-toast-notification/dist/theme-sugar.css';

import "@/mock"; // 在开发环境中启动 mock

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

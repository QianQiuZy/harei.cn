/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "@/stores";
import router from "@/router";
import ToastPlugin from 'vue-toast-notification';

export function registerPlugins(app) {
  app.use(vuetify).use(router).use(pinia).use(ToastPlugin);
}

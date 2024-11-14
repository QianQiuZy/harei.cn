// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Layouts from "vite-plugin-vue-layouts";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";
import VueRouter from "unplugin-vue-router/vite";
import { VueHooksPlusResolver } from "@vue-hooks-plus/resolvers";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import * as https from "https";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }), // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      vueTemplate: true,
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [VueHooksPlusResolver()],
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://43.154.146.167', // 目标服务器地址
        changeOrigin: true, // 是否允许跨域
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 不验证SSL证书
        secure: false,
      },
    },
  },
});

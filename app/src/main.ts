import axios from "axios";
import { createApp } from "vue";

import store from "@/store";

import App from "@/App.vue";
import router from "@/router";

import "bootstrap";
import "@/assets/main.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../node_modules/bootstrap/scss/bootstrap.scss";

axios.interceptors.request.use((config) => {
  store.ui.setters.setIsLoading(true);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    store.ui.setters.setIsLoading(false);
    return response;
  },
  (error) => {
    store.ui.setters.setIsLoading(false);
    return Promise.reject(error);
  }
);

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const app = createApp(App);
app.use(router);
app.mount("#app");

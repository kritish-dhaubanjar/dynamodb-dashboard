import axios from "axios";
import { createApp } from "vue";

import store from "@/store";

import App from "@/App.vue";
import router from "@/router";

import "bootstrap";
import "@/assets/main.css";
import "../node_modules/bootstrap/scss/bootstrap.scss";

axios.interceptors.request.use((config) => {
  store.ui.setters.setIsLoading(true);
  return config;
});

axios.interceptors.response.use((response) => {
  store.ui.setters.setIsLoading(false);
  return response;
});

axios.defaults.baseURL = "http://127.0.0.1:8080/dynamodb/api";
// axios.defaults.baseURL = "/dynamodb/api";

const app = createApp(App);
app.use(router);
app.mount("#app");

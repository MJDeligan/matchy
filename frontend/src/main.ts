// external imports
import { createApp } from "vue";
import { createPinia } from "pinia";
import Vant from "vant";

// TODO: uncomment line below, when you start with styling
// import 'vant/lib/index.css';

// internal imports
import App from "./App.vue";
import router from "./router";

// global styling
import "./assets/base.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Vant);

app.mount("#app");
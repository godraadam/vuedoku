import { createRouter, createWebHistory } from "vue-router";

import App from "@/components/App.vue";
import Landing from "@/components/Landing.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: "/", component: Landing }, { path: "/:input", component: App }],
});

export default router;

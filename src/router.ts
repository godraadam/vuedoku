import { createRouter, createWebHistory } from "vue-router";

import Game from "@/components/Game.vue";
import Landing from "@/components/Landing.vue";
import ThemeProvider from "@/components/ThemeProvider.vue";
import Root from "@/components/Root.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      children: [
        { path: "", component: Root },
        {
          path: "/:difficulty",
          component: ThemeProvider,
          children: [
            { path: "", component: Landing },
            { path: ":input", component: Game },
          ],
        },
      ],
    },
  ],
});

export default router;

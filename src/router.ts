import { createRouter, createWebHistory, RouterView } from "vue-router";

import Game from "@/components/Game.vue";
import Landing from "@/components/Landing.vue";
import DifficultyLayout from "@/components/DifficultyLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      children: [
        { path: "", component: Landing },
        {
          path: "/:difficulty",
          component: DifficultyLayout,
          children: [
            { path: "", component: RouterView },
            { path: ":input", component: Game },
          ],
        },
      ],
    },
  ],
});

export default router;

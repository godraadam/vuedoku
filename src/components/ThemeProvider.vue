<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed, watch } from "vue";
import { difficulties, difficultyColorMap } from "@/consts";
import type { Difficulty } from "@/types";

const route = useRoute();
const difficulty = computed(() =>
  (difficulties.includes((route.params.difficulty as Difficulty) ?? "")
    ? (route.params.difficulty as string)
    : "easy") as Difficulty,
);

watch(
  difficulty,
  () => {
    const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
    shades.forEach((shade) =>
      document.documentElement.style.setProperty(
        `--var-color-theme-${shade}`,
        `var(--color-${difficultyColorMap[difficulty.value]}-${shade})`,
      ),
    );
  },
  { immediate: true },
);
</script>

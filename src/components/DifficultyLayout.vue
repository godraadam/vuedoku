<template>
  <RouterView />
  <Footer />
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { computed, watch } from "vue";

import Footer from "@/components/Footer.vue";
import { difficulties, difficultyColorMap } from "@/consts";
import type { Difficulty } from "@/types";
import { getRandomSudoku } from "@/util";

const route = useRoute();
const router = useRouter();
const difficulty = computed(
  () =>
    (difficulties.includes((route.params.difficulty as Difficulty) ?? "")
      ? (route.params.difficulty as string)
      : "easy") as Difficulty,
);

const input = computed(() => route.params.input as string | undefined);

watch(
  difficulty,
  async () => {
    const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
    shades.forEach((shade) =>
      document.documentElement.style.setProperty(
        `--var-color-theme-${shade}`,
        `var(--color-${difficultyColorMap[difficulty.value]}-${shade})`,
      ),
    );
    if (!input.value) {
      const randomSudoku = await getRandomSudoku(difficulty.value);
      router.replace(`/${difficulty.value}/${randomSudoku}`);
    }
  },
  { immediate: true },
);
</script>

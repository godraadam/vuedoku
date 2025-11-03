<template>
  <main class="flex h-svh w-screen justify-center px-3 md:items-center">
    <div class="flex w-lg flex-col gap-8">
      <h1 class="font-satoshi mt-16 text-5xl font-extralight md:mt-0 md:text-7xl">Sudoku · 数独</h1>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-light text-gray-900">Play random sudoku</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option of difficultyOptions"
            :key="option.to"
            :class="`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-400 px-3 py-2 text-center text-gray-600 hover:border-${option.color}-500 transition-colors`"
            @click="() => onPlay(option.to)"
          >
            {{ option.name }}
            <PlayIcon :class="`size-5 text-${option.color}-600`" />
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between gap-3 text-sm text-gray-900">
        <div class="h-px w-full bg-gray-700" />
        Or
        <div class="h-px w-full bg-gray-700" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="input" class="text-sm font-light text-gray-900">Enter sudoku string</label>
        <input
          v-model="sudokuString"
          id="input"
          :data-valid="!blurred || isValid"
          placeholder="Ex. 0802004005700001000...00003000018007009050"
          class="placeholder:text-thin w-full rounded-lg border border-gray-400 px-4 py-2 text-gray-900 transition duration-300 placeholder:text-gray-400 focus:border-gray-700 focus:outline-none data-[valid=false]:border-red-500"
          @blur="blurred = true"
        />
      </div>
      <button
        :disabled="!isValid"
        class="cursor-pointer rounded-lg border border-gray-400 px-4 py-2 text-black transition duration-300 hover:border-gray-700 disabled:cursor-not-allowed disabled:hover:border-gray-400"
        @click="() => onPlay('custom', sudokuString)"
      >
        Play Custom Sudoku
      </button>
    </div>
  </main>
  <Footer />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import PlayIcon from "@/components/ui/icons/play.svg";
import Footer from "@/components/Footer.vue";
import { difficulties, difficultyColorMap, difficultyNameMap } from "@/consts";
import type { Difficulty } from "@/types";
import { useKeyboardEvent } from "@/composables/useKeyboardEvent";

const router = useRouter();
const sudokuString = ref("");
const blurred = ref(false);
const isValid = computed(
  () =>
    sudokuString.value.length == 81 && sudokuString.value.split("").every((ch) => /[.\d]/.test(ch)),
);

const difficultyOptions = difficulties
  .filter((diff) => diff != "custom")
  .map((difficulty) => ({
    to: difficulty,
    color: difficultyColorMap[difficulty],
    name: difficultyNameMap[difficulty],
  }));

async function onPlay(difficulty: Difficulty, sudokuString?: string) {
  if (difficulty == "custom" && sudokuString) {
    return await router.push(`custom/${sudokuString.trim().replace(/\./g, "0")}`);
  } else {
    return await router.push(`/${difficulty}`);
  }
}

onMounted(() => console.log("Welcome to my sudoku page!"));

useKeyboardEvent((e) => {
  if (e.key == "Enter" && isValid) {
    onPlay("custom", sudokuString.value);
  }
});
</script>

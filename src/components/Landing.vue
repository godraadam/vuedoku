<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <div class="flex flex-col gap-8 w-md">
      <div class="flex flex-col gap-3">
        <button
          v-for="option of difficultyOptions"
          :key="option.to"
          :class="`text-white rounded-lg flex items-center gap-2 justify-center px-3 py-2 w-full text-center cursor-pointer bg-black hover:text-${option.color}-400 transition-colors`"
          @click="() => onPlay(option.to)"
        >
          {{ `Play Random ${option.name} Sudoku` }}
          <PlayIcon :class="`size-5 text-${option.color}-400`"/>
        </button>
      </div>
      <div class="flex gap-3 items-center justify-between">
        <div class="h-px w-full bg-black" />
        Or
        <div class="h-px w-full bg-black" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="input" class="text-sm font-medium text-gray-900">Enter sudoku string</label>
        <input
          v-model="sudokuString"
          id="input"
          :data-valid="!blurred || isValid"
          placeholder="Ex. 90080100...109000603"
          class="rounded-lg w-full px-4 py-2 border border-gray-600 text-gray-900 transition duration-300 placeholder:text-gray-400 focus:border-gray-900 data-[valid=false]:border-red-500 focus:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),0px_0px_0px_4px_#F5F5F5] focus:outline-none"
          @blur="blurred = true"
        />
      </div>
      <button
        :disabled="!isValid"
        class="px-4 py-2 bg-black text-white hover:bg-gray-900 transition duration-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
        @click="() => onPlay('custom', sudokuString)"
      >
        Play Custom Sudoku
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import PlayIcon from "@/components/ui/icons/play.svg";
import { difficulties, difficultyColorMap, difficultyNameMap } from "@/consts";
import type { Difficulty } from "@/types";

const router = useRouter();
const sudokuString = ref("");
const blurred = ref(false);
const isValid = computed(
  () =>
    sudokuString.value.length == 81 && sudokuString.value.split("").every((ch) => /[0-9]/.test(ch)),
);

const difficultyOptions = difficulties
  .filter((diff) => diff != "custom")
  .map((difficulty) => ({
    to: difficulty,
    color: difficultyColorMap[difficulty],
    name: difficultyNameMap[difficulty],
  }));

async function onPlay(difficulty: Difficulty, sudokuString?: string) {
  let data: Array<string> = [];
  // need to spell out import paths for vite
  if (difficulty == "easy") {
    const module = await import("@/sudokus/easy.ts");
    data = module.default as Array<string>;
  } else if (difficulty == "medium") {
    const module = await import("@/sudokus/medium.ts");
    data = module.default as Array<string>;
  } else if (difficulty == "hard") {
    const module = await import("@/sudokus/hard.ts");
    data = module.default as Array<string>;
  } else if (difficulty == "diabolical") {
    const module = await import("@/sudokus/diabolical.ts");
    data = module.default as Array<string>;
  } else if (difficulty == "custom" && sudokuString) {
    return await router.replace(`custom/${sudokuString}`);
  }

  const randomId = Math.floor(Math.random() * 10000);
  return await router.replace(`${difficulty}/${data[randomId]}`);
}

onMounted(() => console.log("Welcome to my sudoku page!"));
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center px-3">
    <div class="flex flex-col gap-8 w-lg">
      <h1 class="text-5xl font-bold mb-6 mt-8 md:mt-0">
        Sudoku by
        <a href="https://godraadam.com" class="hover:text-sky-500 hover:underline transition-colors">godraadam</a>
      </h1>
      <div class="flex flex-col gap-2">
        <label for="input" class="text-sm font-medium text-gray-900">Play random sudoku</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option of difficultyOptions"
            :key="option.to"
            :class="`text-white rounded-xl flex items-center gap-2 justify-center px-3 py-2 w-full h-48 text-center cursor-pointer bg-${option.color}-600 hover:bg-${option.color}-500 transition-colors`"
            @click="() => onPlay(option.to)"
          >
            {{ option.name }}
            <PlayIcon class="size-5 text-white" />
          </button>
        </div>
      </div>
      <div class="flex gap-3 items-center justify-between text-sm text-gray-900">
        <div class="h-px w-full bg-gray-700" />
        Or
        <div class="h-px w-full bg-gray-700" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="input" class="text-sm font-medium text-gray-900">Enter sudoku string</label>
        <input
          v-model="sudokuString"
          id="input"
          :data-valid="!blurred || isValid"
          placeholder="Ex. 0802004005700001000...00003000018007009050"
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
  if (difficulty == "custom" && sudokuString) {
    return await router.push(`custom/${sudokuString}`);
  } else {
    return await router.push(`/${difficulty}`);
  }
}

onMounted(() => console.log("Welcome to my sudoku page!"));
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <div class="flex flex-col gap-2">
      <label for="input" class="text-sm font-medium text-gray-900">Select difficulty</label>
      <div class="flex gap-1 justify-between">
        <RouterLink
          v-for="option of difficultyOptions"
          :key="option.to"
          :data-active="difficulty == option.to"
          :class="`text-gray-600 w-24 cursor-pointer hover:text-${option.color}-500 transition-colors data-[active=true]:text-${option.color}-700 data-[active=true]:hover:text-${option.color}-700`"
          :to="option.to"
        >
          {{ option.name }}
        </RouterLink>
      </div>
      <div class="flex gap-3 items-center justify-between mt-6 mb-4">
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
        :disabled="sudokuString.length > 0 && !isValid"
        class="px-4 py-2 bg-theme-600 text-white hover:bg-theme-600 transition duration-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
        @click="onPlay"
      >
        {{ buttonText }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import useState from "@/composables/useState";
import {
  difficulties,
  difficultyColorMap,
  difficultyNameMap,
  difficultySudokuImportMap,
} from "@/consts";
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const sudokuString = ref("");
const blurred = ref(false);
const isValid = computed(
  () =>
    sudokuString.value.length == 81 && sudokuString.value.split("").every((ch) => /[0-9]/.test(ch)),
);

const { difficulty } = useState();

const buttonText = computed(
  () =>
    `Play ${sudokuString.value.length > 1 ? "custom" : "random"} ${sudokuString.value.length > 1 ? "" : difficulty.value} sudoku`,
);

const difficultyOptions = difficulties.map((difficulty) => ({
  to: difficulty,
  color: difficultyColorMap[difficulty],
  name: difficultyNameMap[difficulty],
}));

async function onPlay() {
  if (sudokuString.value) {
    return await router.replace(sudokuString.value);
  }
  const module = await import(difficultySudokuImportMap[difficulty.value]);

  const data = module.default as Array<string>;
  const randomId = Math.floor(Math.random() * 10000);
  return await router.replace(`${difficulty.value}/${data[randomId]}`);
}

onMounted(() => console.log("Welcome to my sudoku page!"));
</script>

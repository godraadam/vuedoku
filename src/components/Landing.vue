<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const sudokuString = ref("");
const blurred = ref(false);
const isValid = computed(
  () =>
    sudokuString.value.length == 81 && sudokuString.value.split("").every((ch) => /[0-9]/.test(ch)),
);

function onPlay() {
  router.replace(sudokuString.value);
}
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label for="input" class="text-sm font-medium text-gray-900">Enter sudoku string</label>
        <input
          v-model="sudokuString"
          id="input"
          :data-valid="!blurred || isValid"
          placeholder="Ex. 90080100...109000603"
          class="rounded-lg w-sm md:w-md px-4 py-2 border border-gray-600 text-gray-900 transition duration-300 placeholder:text-gray-400 focus:border-gray-900 data-[valid=false]:border-red-500 focus:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),0px_0px_0px_4px_#F5F5F5] focus:outline-none"
          @blur="blurred = true"
        />
      </div>
      <button
        :disabled="!isValid"
        class="px-4 py-2 bg-gray-900 text-white hover:bg-gray-700 transition duration-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
        @click="onPlay"
      >
        Play
      </button>
    </div>
  </main>
</template>

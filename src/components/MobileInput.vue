<template>
  <div class="h-fit mt-6 space-y-2">
    <div class="flex gap-2">
      <button
        class="font-medium text-gray-900 data-[mode=normal]:text-theme-600"
        :data-mode="mode"
        @click="mode = 'normal'"
      >
        Normal
      </button>
      <button
        class="font-medium text-gray-900 data-[mode=candidate]:text-theme-600"
        :data-mode="mode"
        @click="mode = 'candidate'"
      >
        Candidate
      </button>
    </div>
    <div class="w-full grid grid-cols-5 grid-rows-2 gap-2">
      <button
        v-for="i in 9"
        :data-mode="mode"
        :key="i"
        class="flex items-center justify-center border-2 border-gray-300 text-theme-700/90 text-2xl aspect-square data-[mode=candidate]:text-xs"
        @click="handleClick(i)"
      >
        {{ i }}
      </button>
      <button
        class="flex items-center justify-center border-2 border-gray-300 text-theme-700/90 text-2xl aspect-square"
        @click="emits('input', 'remove', 0)"
      >
        X
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mode = ref<"normal" | "candidate">("normal");

const emits = defineEmits<{ input: ["place" | "eliminate" | "remove", number] }>();

function handleClick(digit: number) {
  if (mode.value == "normal") {
    emits("input", "place", digit - 1);
  } else {
    emits("input", "eliminate", digit - 1);
  }
}
</script>

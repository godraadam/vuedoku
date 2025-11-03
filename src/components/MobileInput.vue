<template>
  <div id="mobile-keyboard-wrapper" class="mt-6 h-fit space-y-2">
    <div class="flex gap-2">
      <button
        class="data-[mode=normal]:text-theme-600 font-medium text-gray-900"
        :data-mode="mode"
        @click="mode = 'normal'"
      >
        Normal
      </button>
      <button
        class="data-[mode=candidate]:text-theme-600 font-medium text-gray-900"
        :data-mode="mode"
        @click="mode = 'candidate'"
      >
        Candidate
      </button>
    </div>
    <div class="grid w-full grid-cols-5 grid-rows-2 gap-1.5">
      <button
        v-for="i in 9"
        :data-mode="mode"
        :key="i"
        class="flex h-12 w-full items-center justify-center border-2 border-gray-300 text-2xl text-gray-900 data-[mode=candidate]:text-sm"
        @click="handleClick(i)"
      >
        {{ i }}
      </button>
      <button
        class="flex h-12 w-full items-center justify-center border-2 border-gray-300 text-2xl text-gray-900"
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

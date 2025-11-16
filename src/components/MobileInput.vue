<template>
  <div id="mobile-keyboard-wrapper" class="mt-2 h-fit space-y-1.5">
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
    <div class="grid grid-cols-5 grid-rows-2 gap-1.5">
      <button
        v-for="i in 9"
        :data-mode="mode"
        :key="i - 1"
        :disabled="isDigitCompleted(i)"
        class="active:bg-theme-200 flex h-12 items-center justify-center border-2 border-gray-300 text-2xl text-gray-900 transition-colors duration-100 ease-in disabled:pointer-events-none disabled:opacity-50 data-[mode=candidate]:text-sm"
        v-on-long-press="(_) => handleLongPress(i)"
        @click="handleClick(i)"
      >
        {{ i }}
      </button>
      <button
        class="flex h-12 items-center justify-center border-2 border-gray-300 text-2xl text-gray-900"
        @click="emits('input', 'remove', 0)"
      >
        X
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { vOnLongPress } from "@vueuse/components";

import useState from "@/composables/useState";

const mode = ref<"normal" | "candidate">("normal");
const longPressed = ref(false);

const emits = defineEmits<{ input: ["place" | "eliminate" | "remove", number] }>();

const { sudoku, highlightedDigit } = useState();

function handleClick(digit: number) {
  if (longPressed.value) {
    longPressed.value = false;
    highlightedDigit.value = undefined;
    return;
  }
  if (mode.value == "normal") {
    emits("input", "place", digit - 1);
  } else {
    emits("input", "eliminate", digit - 1);
  }
}

function handleLongPress(digit: number) {
  longPressed.value = true;
  highlightedDigit.value = digit - 1;
}

function isDigitCompleted(digit: number) {
  return sudoku.value.isDigitCompleted(digit - 1);
}
</script>

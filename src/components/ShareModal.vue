<template>
  <Modal :is-open @close="emits('close')">
    <div class="w-[728px] h-[680px]">
      <h1 class="text-3xl font-medium">Share Puzzle</h1>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/ui/Modal.vue";
// import useState from "@/composables/useState";
// import { computed } from "vue";

defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ close: [] }>();

// const { input, sudoku, difficulty } = useState();

// const shareLink = window.location.origin + window.location.pathname;
// const shareLinkTruncated =
//   shareLink.length > 50 ? shareLink.slice(0, 30) + "..." + shareLink.slice(-10) : shareLink;

// const originalPuzzleString = input.value || "";
// const originalPuzzleStringTruncated =
//   originalPuzzleString.length > 50
//     ? originalPuzzleString.slice(0, 30) + "..." + originalPuzzleString.slice(-10)
//     : originalPuzzleString;

// const currentPuzzleString = computed(() => sudoku.value.encodeState());
// const currentPuzzleStringTruncated = computed(() =>
//   currentPuzzleString.value.length > 50
//     ? currentPuzzleString.value.slice(0, 30) + "..." + currentPuzzleString.value.slice(-10)
//     : currentPuzzleString.value,
// );

// const currrentPuzzleLink = computed(
//   () => window.location.origin + "/" + difficulty.value + "/" + currentPuzzleString.value,
// );
// const currrentPuzzleLinkTruncated = computed(() =>
//   currrentPuzzleLink.value.length > 50
//     ? currrentPuzzleLink.value.slice(0, 30) + "..." + currrentPuzzleLink.value.slice(-10)
//     : currrentPuzzleLink.value,
// );

// function onCopy(text: string) {
//   navigator.clipboard.writeText(text);
// }
</script>

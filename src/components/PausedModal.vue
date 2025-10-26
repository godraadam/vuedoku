<template>
  <Modal :is-open @close="emits('close')">
    <div class="w-[728px] h-[680px]">
      <h1 class="text-3xl font-medium pb-10">Menu</h1>
      <h2 class="text-xl font-medium text-gray-900 pb-5">Settings</h2>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <input
            v-model="autoCandidates"
            type="checkbox"
            id="auto-candidates"
            class="rounded-md accent-blue-600 size-3.5"
          />
          <label for="auto-candidates" class="text-sm text-gray-900">Auto Candidates</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="autoHint"
            type="checkbox"
            id="auto-hints"
            class="rounded-md accent-blue-600 size-3.5"
          />
          <label for="auto-hints" class="text-sm text-gray-900">Auto Hints</label>
        </div>
        <!-- <div class="flex items-center gap-2">
          <input
            v-model="showTimer"
            type="checkbox"
            id="show-timer"
            class="rounded-md accent-blue-600 size-3.5"
          />
          <label for="show-timer" class="text-sm text-gray-900">Show Timer</label>
        </div> -->
      </div>
      <h2 class="text-xl font-medium text-gray-900 pb-5 pt-10">Share</h2>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label for="share-link" class="text-sm w-48 font-medium">Puzzle Link (Original)</label>
          <div
            id="share-link"
            class="text-sm text-gray-900 hover:text-blue-500 transition-colors cursor-pointer font-light"
            @click="() => onCopy(shareLink)"
          >
            {{ shareLinkTruncated }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label for="share-link" class="text-sm w-48 font-medium">Puzzle Link (Current State)</label>
          <div
            id="share-link"
            class="text-sm text-gray-900 hover:text-blue-500 transition-colors cursor-pointer font-light"
            @click="() => onCopy(currrentPuzzleLink)"
          >
            {{ currrentPuzzleLinkTruncated }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label for="share-string" class="text-sm w-48 font-medium">Puzzle String (Original)</label>
          <div
            id="share-string"
            class="text-sm text-gray-900 hover:text-blue-500 transition-colors cursor-pointer font-light"
            @click="() => onCopy(originalPuzzleString)"
          >
            {{ originalPuzzleStringTruncated }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label for="share-string" class="text-sm w-48 font-medium"
            >Puzzle String (Current State)</label
          >
          <div
            id="share-string"
            class="text-sm text-gray-900 hover:text-blue-500 transition-colors cursor-pointer font-light"
            @click="() => onCopy(currentPuzzleString)"
          >
            {{ currentPuzzleStringTruncated }}
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/ui/Modal.vue";
import useState from "@/composables/useState";

const { autoCandidates, autoHint, input, sudoku } = useState();

const shareLink = window.location.origin + window.location.pathname;
const shareLinkTruncated =
  shareLink.length > 50 ? shareLink.slice(0, 30) + "..." + shareLink.slice(-10) : shareLink;

const originalPuzzleString = input.value || "";
const originalPuzzleStringTruncated =
  originalPuzzleString.length > 50
    ? originalPuzzleString.slice(0, 30) + "..." + originalPuzzleString.slice(-10)
    : originalPuzzleString;

const currentPuzzleString = sudoku.value.encodeState();
const currentPuzzleStringTruncated =
  currentPuzzleString.length > 50
    ? currentPuzzleString.slice(0, 30) + "..." + currentPuzzleString.slice(-10)
    : currentPuzzleString;

const currrentPuzzleLink =
  window.location.origin + window.location.pathname + "/" + currentPuzzleString;
const currrentPuzzleLinkTruncated =
  currrentPuzzleLink.length > 50
    ? currrentPuzzleLink.slice(0, 30) + "..." + currrentPuzzleLink.slice(-10)
    : currrentPuzzleLink;

defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ close: [] }>();

function onCopy(text: string) {
  navigator.clipboard.writeText(text);
}
</script>

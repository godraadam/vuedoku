<template>
  <main class="h-screen w-screen flex items-center justify-center gap-8">
    <div class="space-y-2">
      <div class="text-gray-900 font-medium flex gap-4 min-h-6 w-full justify-between items-center">
        <IconButton class="pl-0" @click="router.push(`/${difficulty}`)"
          ><ChevronLeftIcon class="size-5" />Back</IconButton
        >
        <div v-if="autoHint" class="font-light text-sm">
          {{ nextStep ? nextStep.reason : isSolved ? "Solved" : "No idea fam" }}
        </div>
        <div class="flex items-center gap-3">
          <div :class="`text-${difficultyColorMap[difficulty]}-700`">
            {{ difficultyNameMap[difficulty] }}
          </div>
          <IconButton class="font-light w-24" @click="onTogglePause"
            >{{ time }}<PlayIcon v-if="!running" class="size-5" /><PauseIcon v-else class="size-5"
          /></IconButton>
          <IconButton @click="reset"><ResetIcon class="size-5" /> </IconButton>
          <IconButton @click="onToggleLike">
            <HeartFilledIcon v-if="isLiked" class="size-5 text-theme-500" />
            <HeartOutlineIcon v-else class="size-5" />
          </IconButton>
          <IconButton @click="onTogglePause">
            <ShareIcon class="size-5" />
          </IconButton>
          <IconButton @click="onTogglePause">
            <SettingsIcon class="size-5" />
          </IconButton>
        </div>
      </div>
      <Sudoku />
    </div>
  </main>
  <PausedModal :is-open="pauseModalOpen" @close="onTogglePause" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Sudoku from "@/components/Sudoku.vue";
import useState from "@/composables/useState";
import IconButton from "@/components/ui/IconButton.vue";
import PlayIcon from "@/components/ui/icons/play.svg";
import PauseIcon from "@/components/ui/icons/pause.svg";
import ResetIcon from "@/components/ui/icons/reset.svg";
import SettingsIcon from "@/components/ui/icons/settings.svg";
import HeartFilledIcon from "@/components/ui/icons/heart-filled.svg";
import HeartOutlineIcon from "@/components/ui/icons/heart-outline.svg";
import ChevronLeftIcon from "@/components/ui/icons/chevron-left.svg";
import PausedModal from "@/components/PausedModal.vue";
import ShareIcon from "@/components/ui/icons/share.svg";
import { useKeyboardEvent } from "@/composables/useKeyboardEvent";
import { useRouter } from "vue-router";
import { difficultyColorMap, difficultyNameMap } from "@/consts";

const pauseModalOpen = ref(false);

const { isSolved, autoHint, nextStep, running, time, reset, input, difficulty } = useState();

const router = useRouter();

const isLiked = ref(
  (JSON.parse(localStorage.getItem("likedPuzzles") ?? "[]") as Array<string>).includes(
    input.value!,
  ),
);

function onToggleLike() {
  const likedPuzzlesStr = localStorage.getItem("likedPuzzles");
  if (likedPuzzlesStr) {
    const likedPuzzles = JSON.parse(likedPuzzlesStr) as Array<string>;
    if (likedPuzzles.includes(input.value!)) {
      localStorage.setItem(
        "likedPuzzles",
        JSON.stringify(likedPuzzles.filter((it) => it != input.value)),
      );
    } else {
      localStorage.setItem("likedPuzzles", JSON.stringify([...likedPuzzles, input.value]));
    }
  } else {
    localStorage.setItem("likedPuzzles", JSON.stringify([input.value]));
  }
  isLiked.value = !isLiked.value;
}

function onTogglePause() {
  running.value = !running.value;
  pauseModalOpen.value = !pauseModalOpen.value;
}

watch(isSolved, () => (running.value = false));
useKeyboardEvent((e) => {
  if (e.code == "Space") {
    onTogglePause();
  }
});
</script>

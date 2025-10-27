<template>
  <div class="h-screen pt-2 md:pt-0 md:flex md:items-center md:justify-center gap-8 px-2">
    <div class="absolute top-1/2 flex justify-center">
      <ConfettiExplosion
        v-if="isSolved"
        :particleCount="75"
        :force="0.6"
        :colors="[
          'var(--color-orange-500)',
          'var(--color-green-500)',
          'var(--color-blue-500)',
          'var(--color-red-500)',
        ]"
      />
    </div>
    <div class="space-y-2">
      <div
        class="text-gray-900 font-medium flex md:gap-4 min-h-6 w-full justify-between items-center"
      >
        <IconButton class="pl-0" @click="onExit"><ChevronLeftIcon class="size-5" />Back</IconButton>
        <div v-if="showHint" class="font-light text-sm hidden md:block">
          {{ nextStep ? nextStep.reason : isSolved ? "Solved" : "No idea fam" }}
        </div>
        <div class="flex items-center md:gap-3">
          <div :class="`hidden md:block text-${difficultyColorMap[difficulty]}-700`">
            {{ difficultyNameMap[difficulty] }}
          </div>

          <Tooltip>
            <IconButton class="font-light w-24" @click="onTogglePause"
              >{{ time }}<PlayIcon v-if="!running" class="size-5" /><PauseIcon
                v-else
                class="size-5"
            /></IconButton>
            <template #popper
              >{{ running ? "Pause Game" : "Resume Game" }}
              <span class="text-sm font-mono text-gray-400"> [Spacebar]</span></template
            >
          </Tooltip>
          <Tooltip>
            <IconButton @click="reset"><ResetIcon class="size-5" /> </IconButton>
            <template #popper
              >Reset puzzle <span class="text-sm font-mono text-gray-400">[Cmd+R]</span></template
            >
          </Tooltip>
          <Tooltip>
            <IconButton @click="onToggleLike">
              <HeartFilledIcon v-if="isLiked" class="size-5 text-theme-500" />
              <HeartOutlineIcon v-else class="size-5" />
            </IconButton>
            <template #popper
              >{{ isLiked ? "Unlike" : "Like" }}
              <span class="text-sm font-mono text-gray-400"> [Cmd+L]</span></template
            >
          </Tooltip>

          <Tooltip>
            <IconButton @click="showHint = true" @dblclick="autoHint = !autoHint"
              ><HintIcon v-if="!showHint" class="size-5" /><HintIconFilled
                v-else
                class="size-5 text-theme-500"
              />
            </IconButton>
            <template #popper
              >Get a hint <span class="text-sm font-mono text-gray-400"> [Cmd+H]</span></template
            >
          </Tooltip>
          <Tooltip>
            <IconButton @click="onToggleShare(true)">
              <ShareIcon class="size-5" />
            </IconButton>
            <template #popper>Share Puzzle</template>
          </Tooltip>
          <Tooltip>
            <IconButton @click="onToggleSettings(true)">
              <SettingsIcon class="size-5" />
            </IconButton>
            <template #popper>Open Settings</template>
          </Tooltip>
        </div>
      </div>
      <Sudoku />
      <div v-if="showHint" class="font-light text-sm md:hidden">
        {{ nextStep ? nextStep.reason : isSolved ? "Solved" : "No idea fam" }}
      </div>
      <MobileInput class="block md:hidden" @input="onMobileInput" />
    </div>
  </div>
  <PausedModal :is-open="pauseModalOpen" @close="onTogglePause" />
  <GameEndModal :is-open="gameEndModelOpen" @close="gameEndModelOpen = false" />
  <SettingsModal :is-open="settingsModalOpen" @close="onToggleSettings(false)" />
  <ShareModal :is-open="shareModalOpen" @close="onToggleShare(false)" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import ConfettiExplosion from "vue-confetti-explosion";
import { Tooltip } from "floating-vue";

import Sudoku from "@/components/Sudoku.vue";
import useState from "@/composables/useState";
import IconButton from "@/components/ui/Button.vue";
import PlayIcon from "@/components/ui/icons/play.svg";
import PauseIcon from "@/components/ui/icons/pause.svg";
import ResetIcon from "@/components/ui/icons/reset.svg";
import SettingsIcon from "@/components/ui/icons/settings.svg";
import HeartFilledIcon from "@/components/ui/icons/heart-filled.svg";
import HeartOutlineIcon from "@/components/ui/icons/heart-outline.svg";
import HintIcon from "@/components/ui/icons/lightbulb.svg";
import HintIconFilled from "@/components/ui/icons/lightbulb-filled.svg";
import ChevronLeftIcon from "@/components/ui/icons/chevron-left.svg";
import PausedModal from "@/components/PausedModal.vue";
import ShareIcon from "@/components/ui/icons/share.svg";
import { useKeyboardEvent } from "@/composables/useKeyboardEvent";
import GameEndModal from "@/components/GameEndModal.vue";
import { difficultyColorMap, difficultyNameMap } from "@/consts";
import SettingsModal from "@/components/SettingsModal.vue";
import ShareModal from "@/components/ShareModal.vue";
import MobileInput from "@/components/MobileInput.vue";

const pauseModalOpen = ref(false);
const gameEndModelOpen = ref(false);
const settingsModalOpen = ref(false);
const shareModalOpen = ref(false);

const {
  isSolved,
  nextStep,
  running,
  time,
  reset,
  input,
  difficulty,
  showHint,
  autoHint,
  sudoku,
  focusedCell,
} = useState();

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

function onToggleSettings(open: boolean) {
  running.value = !open;
  settingsModalOpen.value = open;
}

function onToggleShare(open: boolean) {
  running.value = !open;
  shareModalOpen.value = open;
}

function onMobileInput(type: "remove" | "place" | "eliminate", digit: number) {
  if (type == "eliminate") {
    const candidate = focusedCell.value.getCandidate(digit);
    return sudoku.value.setCandidate(candidate, !candidate.isSet());
  } else if (type == "place") {
    sudoku.value.placeValueInCell(focusedCell.value.getCellIdx(), digit);
  } else {
    sudoku.value.removeValueFromCell(focusedCell.value.getCellIdx());
  }
}

watch(isSolved, () => {
  if (isSolved.value) {
    running.value = false;
    gameEndModelOpen.value = true;
  }
});

function onExit() {
  router.push("/");
}

useKeyboardEvent((e) => {
  if (e.code == "Space") {
    onTogglePause();
  } else if (e.key == "h" && e.metaKey) {
    showHint.value = true;
  } else if (e.key == "l" && e.metaKey) {
    onToggleLike();
  } else if (e.key == "r" && e.metaKey) {
    reset();
  } else if (e.key == "w" && e.metaKey) {
    onExit();
  }
});
</script>

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
          'var(--color-fuchsia-500)',
        ]"
      />
    </div>
    <div class="space-y-2">
      <div
        class="text-gray-900 font-medium flex md:gap-4 min-h-6 w-full justify-between items-center"
      >
        <IconButton class="pl-0" @click="onExit"><ChevronLeftIcon class="size-5" />Back</IconButton>
        <div v-if="showHint" class="font-light text-sm hidden md:block max-w-[300px]">
          {{ nextStep ? nextStep.reason : isSolved ? "Solved" : "No idea fam" }}
        </div>
        <div class="flex items-center md:gap-3">
          <div :class="`hidden md:block text-${difficultyColorMap[difficulty]}-700`">
            {{ difficultyNameMap[difficulty] }}
          </div>

          <Tooltip delay="1000">
            <IconButton class="font-light w-24" :disabled="isSolved" @click="onTogglePause"
              >{{ time }}<PlayIcon v-if="!running" class="size-5" /><PauseIcon
                v-else
                class="size-5"
            /></IconButton>
            <template #popper
              >{{ running ? "Pause Game" : "Resume Game" }}
              <span class="text-sm font-mono text-gray-400"> [Spacebar]</span></template
            >
          </Tooltip>
          <Tooltip delay="1000">
            <IconButton @click="reset"><ResetIcon class="size-5" /> </IconButton>
            <template #popper
              >Reset puzzle <span class="text-sm font-mono text-gray-400">[Cmd+R]</span></template
            >
          </Tooltip>
          <Tooltip delay="1000">
            <IconButton @click="onToggleLike">
              <HeartFilledIcon v-if="isLiked" class="size-5 text-theme-500" />
              <HeartOutlineIcon v-else class="size-5" />
            </IconButton>
            <template #popper
              >{{ isLiked ? "Unlike" : "Like" }}
              <span class="text-sm font-mono text-gray-400"> [Cmd+L]</span></template
            >
          </Tooltip>

          <Tooltip delay="1000">
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
          <Tooltip delay="1000">
            <DropDownContext :close-on-select="false">
              <DropDownTrigger>
                <IconButton>
                  <ShareIcon class="size-5" />
                </IconButton>
              </DropDownTrigger>
              <DropDownContent class="w-64">
                <DropDownItem class="whitespace-nowrap text-sm">
                  <CopyIcon v-if="!linkCopied" class="size-5 text-gray-900" />
                  <CoypCheckIcon v-else class="size-5 text-theme-600" />
                  <button class="w-full text-left" @click="onCopy('original')">
                    Copy link to puzzle
                  </button></DropDownItem
                >
                <DropDownItem class="whitespace-nowrap text-sm w-full"
                  ><CopyIcon v-if="!currentsStateLinkCopied" class="size-5 text-gray-900" />
                  <CoypCheckIcon v-else class="size-5 text-theme-600" />
                  <button class="w-full text-left" @click="onCopy('current')">
                    Copy link to current state
                  </button></DropDownItem
                >
              </DropDownContent>
            </DropDownContext>
            <template #popper>Share Puzzle</template>
          </Tooltip>
          <Tooltip delay="1000">
            <DropDownContext :close-on-select="false">
              <DropDownTrigger>
                <IconButton> <SettingsIcon class="size-5" /> </IconButton
              ></DropDownTrigger>
              <DropDownContent class="w-64">
                <DropDownItem class="whitespace-nowrap text-sm"
                  ><div class="flex gap-2 items-center w-full">
                    <input
                      v-model="autoCandidates"
                      type="checkbox"
                      class="size-4 accent-theme-600 rounded-lg"
                      id="auto-candidates"
                    /><label for="auto-candidates" class="text-gray-900 text-sm w-full"
                      >Auto Candidates</label
                    >
                  </div></DropDownItem
                >
                <DropDownItem class="whitespace-nowrap text-sm"
                  ><div class="flex gap-2 items-center w-full">
                    <input
                      v-model="autoHint"
                      type="checkbox"
                      class="size-4 accent-theme-600 rounded-lg"
                      id="auto-hint"
                    /><label for="auto-hint" class="text-gray-900 text-sm w-full">Auto Hints</label>
                  </div></DropDownItem
                >
                <DropDownItem class="whitespace-nowrap text-sm"
                  ><div class="flex gap-2 items-center w-full">
                    <input
                      v-model="autoHighlight"
                      type="checkbox"
                      class="size-4 accent-theme-600 rounded-lg"
                      id="auto-highlight"
                    /><label for="auto-highlight" class="text-gray-900 text-sm w-full"
                      >Auto Highlight</label
                    >
                  </div></DropDownItem
                >
              </DropDownContent>
            </DropDownContext>
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
  <GameEndModal :is-open="gameEndModelOpen" @close="gameEndModelOpen = false" />
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
import CopyIcon from "@/components/ui/icons/copy.svg";
import CoypCheckIcon from "@/components/ui/icons/check-copied.svg";
import SettingsIcon from "@/components/ui/icons/settings.svg";
import HeartFilledIcon from "@/components/ui/icons/heart-filled.svg";
import HeartOutlineIcon from "@/components/ui/icons/heart-outline.svg";
import HintIcon from "@/components/ui/icons/lightbulb.svg";
import HintIconFilled from "@/components/ui/icons/lightbulb-filled.svg";
import ChevronLeftIcon from "@/components/ui/icons/chevron-left.svg";
import ShareIcon from "@/components/ui/icons/share.svg";
import { useKeyboardEvent } from "@/composables/useKeyboardEvent";
import GameEndModal from "@/components/GameEndModal.vue";
import { difficultyColorMap, difficultyNameMap } from "@/consts";
import MobileInput from "@/components/MobileInput.vue";
import DropDownContext from "@/components/ui/dropdown/DropDownContext.vue";
import DropDownTrigger from "@/components//ui/dropdown/DropDownTrigger.vue";
import DropDownContent from "@/components//ui/dropdown/DropDownContent.vue";
import DropDownItem from "@/components//ui/dropdown/DropDownItem.vue";

const gameEndModelOpen = ref(false);

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
  autoHighlight,
  autoCandidates,
  sudoku,
  focusedCell,
} = useState();

const router = useRouter();

const linkCopied = ref(false);
const currentsStateLinkCopied = ref(false);

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
}

function onMobileInput(type: "remove" | "place" | "eliminate", digit: number) {
  if (!running.value) {
    return;
  }
  if (type == "eliminate") {
    const candidate = focusedCell.value.getCandidate(digit);
    return sudoku.value.setCandidate(candidate, !candidate.isSet());
  } else if (type == "place") {
    sudoku.value.placeValueInCell(focusedCell.value.getCellIdx(), digit);
  } else {
    sudoku.value.removeValueFromCell(focusedCell.value.getCellIdx());
  }
}

function onExit() {
  router.push("/");
}

watch(isSolved, () => {
  if (isSolved.value) {
    running.value = false;
    gameEndModelOpen.value = true;
  }
});

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

async function onCopy(state: "original" | "current") {
  if (state == "original") {
    await window.navigator.clipboard.writeText(window.location.origin + window.location.pathname);
    linkCopied.value = true;
  } else {
    await window.navigator.clipboard.writeText(
      window.location.origin + "/" + difficulty.value + "/" + sudoku.value.encodeState(),
    );
    currentsStateLinkCopied.value = true;
  }
}
</script>

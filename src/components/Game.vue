<template>
  <div class="h-screen pt-2 md:pt-0 md:flex md:items-center md:justify-center gap-8 px-2">
    <div id="confetti-wrapper" class="absolute top-1/2 flex justify-center">
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
      <GameControls />
      <Sudoku />
      <div v-if="showHint" class="font-light text-sm md:hidden flex items-center gap-1">
        {{ nextStep ? nextStep.reporter.getName() : isSolved ? "Solved" : "Stuck" }}
        <a v-if="nextStep?.reporter.getLink()" :href="nextStep?.reporter.getLink()" target="_blank"
          ><IconButton><InfoIcon class="size-4" /> </IconButton
        ></a>
      </div>
      <div v-if="debugMode">
        Cell {{ focusedCell.getCellIdx() }}, Candidate {{ focusedCandidate.getCandidateIdx() }}
      </div>
      <MobileInput class="block md:hidden" @input="onMobileInput" />
    </div>
  </div>
  <GameEndModal :is-open="gameEndModelOpen" @close="gameEndModelOpen = false" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import Sudoku from "@/components/Sudoku.vue";
import useState from "@/composables/useState";
import IconButton from "@/components/ui/Button.vue";
import InfoIcon from "@/components/ui/icons/info-circle.svg";
import GameEndModal from "@/components/GameEndModal.vue";
import MobileInput from "@/components/MobileInput.vue";
import GameControls from "@/components/GameControls.vue";

const gameEndModelOpen = ref(false);

const {
  isSolved,
  nextStep,
  running,
  showHint,
  debugMode,
  sudoku,
  focusedCell,
  focusedCandidate,
} = useState();

function onMobileInput(type: "remove" | "place" | "eliminate", digit: number) {
  if (!running.value) {
    return;
  }
  if (type == "eliminate") {
    const candidate = focusedCell.value.getCandidate(digit);
    return sudoku.value.setCandidate(candidate, !candidate.isSet(), true, true);
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
</script>

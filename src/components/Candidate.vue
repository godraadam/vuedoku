<template>
  <div
    :class="
      cn(
        'text-xs md:text-base pointer-events-none md:pointer-events-auto font-thin text-transparent group-hover:text-gray-500 border-gray-500 rounded-full flex justify-center items-center cursor-pointer hover:text-gray-900 transition-colors duration-100 ease-out',
        isOn && 'text-gray-500 font-light group-hover:text-gray-900',
        canBeRemoved && 'crossed',
        canBePlaced && 'text-white bg-theme-600 group-hover:text-white hover:text-white',
        isHighLighted && 'text-theme-600 font-bold',
        isParticipant && 'border',
      )
    "
    :data-on="isOn"
    :data-place="canBePlaced"
    :data-participant="isParticipant"
    @click="handleClick"
  >
    {{ candidate.getDigit() + 1 }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import useState from "@/composables/useState";
import type CandidateModel from "@/model/Candidate";
import { cn } from "@/util";

const props = defineProps<{
  candidate: CandidateModel;
}>();

const isOn = computed(() =>
  autoCandidates.value
    ? props.candidate.isSet()
    : sudoku.value.getUserSetCandidates().get(props.candidate),
);

const isHighLighted = computed(
  () =>
    !canBePlaced.value &&
    !canBeRemoved.value &&
    props.candidate.isSet() &&
    highlightedDigit.value == props.candidate.getDigit(),
);

const {
  candidateToPlace,
  candidatesToRemove,
  eliminationParticipants,
  highlightedDigit,
  showHint,
  sudoku,
  autoCandidates,
} = useState();

const canBeRemoved = computed(
  () => showHint.value && candidatesToRemove.value.some((c) => c.equals(props.candidate)),
);

const canBePlaced = computed(
  () => showHint.value && candidateToPlace.value?.equals(props.candidate),
);

const isParticipant = computed(
  () => showHint.value && eliminationParticipants.value.some((p) => p.equals(props.candidate)),
);

function handleClick(e: PointerEvent) {
  if (e.metaKey) {
    sudoku.value.placeValueInCell(
      props.candidate.getCell().getCellIdx(),
      props.candidate.getDigit(),
    );
  } else {
    sudoku.value.setCandidate(props.candidate, !props.candidate.isSet());
  }
}
</script>

<style scoped>
.crossed {
  position: relative;
}

.crossed::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: red;
  transform: rotate(-45deg);
  transform-origin: center;
}
</style>

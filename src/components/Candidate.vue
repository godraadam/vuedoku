<template>
  <div
    ref="root"
    :class="
      cn(
        'pointer-events-none z-10 flex cursor-pointer items-center justify-center rounded-full border-gray-500 text-xs font-thin text-transparent transition-colors duration-100 ease-out group-hover:text-gray-500 hover:text-gray-900 md:pointer-events-auto md:text-base',
        isOn && 'font-light text-gray-500 group-hover:text-gray-900',
        canBeRemoved && 'crossed',
        canBePlaced && 'bg-theme-600 text-white group-hover:text-white hover:text-white',
        isHighLighted && 'border',
        isParticipant && 'border',
      )
    "
    :data-on="isOn"
    :data-place="canBePlaced"
    :data-participant="isParticipant"
    @mouseenter="focusedCandidate = candidate"
    @click="handleClick"
  >
    {{ candidate.getDigit() + 1 }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from "vue";

import useState from "@/composables/useState";
import type CandidateModel from "@/model/Candidate";
import { cn } from "@/util";

const props = defineProps<{
  candidate: CandidateModel;
}>();

const rootRef = useTemplateRef("root");

const isOn = computed(() =>
  autoCandidates.value
    ? props.candidate.isSet()
    : sudoku.value.getUserSetCandidates().get(props.candidate.getCandidateIdx()),
);

const isHighLighted = computed(
  () =>
    !canBePlaced.value &&
    !canBeRemoved.value &&
    (autoCandidates
      ? props.candidate.isSet()
      : sudoku.value.getUserSetCandidates().get(props.candidate.getCandidateIdx())) &&
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
  candidatePositions,
  focusedCandidate,
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
    const state = autoCandidates.value
      ? !props.candidate.isSet()
      : !sudoku.value.getUserSetCandidates().get(props.candidate.getCandidateIdx());
    sudoku.value.setCandidate(props.candidate, state, true, true);
  }
}

onMounted(() => {
  // register position
  const box = rootRef.value!.getBoundingClientRect();
  candidatePositions.value.set(props.candidate.getCandidateIdx(), box);
});
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

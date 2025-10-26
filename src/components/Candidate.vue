<template>
  <div
    class="text-xs lg:text-base font-thin text-transparent data-[on=true]:text-gray-500 data-[on=true]:font-extralight group-hover:text-gray-500 data-[on=true]:group-hover:text-gray-900 data-[place=true]:text-blue-500 data-[place=true]:font-medium data-[remove=true]:text-red-600 data-[participant=true]:border border-gray-500 rounded-full flex justify-center items-center data-[remove=true]:font-medium cursor-pointer hover:text-gray-900 transition-colors duration-100 ease-out"
    :data-on="isOn"
    :data-place="canBePlaced"
    :data-remove="canBeRemoved"
    :data-participant="isParticipant"
    @click="handleClick"
  >
    {{ candidate.getDigit() + 1 }}
  </div>
</template>

<script setup lang="ts">
import useState from "@/composables/useState";
import type CandidateModel from "@/model/Candidate";
import { computed } from "vue";

const props = defineProps<{
  candidate: CandidateModel;
}>();

const isOn = computed(() =>
  autoCandidates.value
    ? props.candidate.getState()
    : sudoku.value.getUserSetCandidates().get(props.candidate),
);
const {
  candidateToPlace,
  candidatesToRemove,
  eliminationParticipants,
  autoHint,
  sudoku,
  autoCandidates,
} = useState();

const canBeRemoved = computed(
  () => autoHint.value && candidatesToRemove.value.some((c) => c.equals(props.candidate)),
);

const canBePlaced = computed(
  () => autoHint.value && candidateToPlace.value?.equals(props.candidate),
);

const isParticipant = computed(
  () => autoHint.value && eliminationParticipants.value.some((p) => p.equals(props.candidate)),
);

function handleClick(e: PointerEvent) {
  if (e.metaKey) {
    sudoku.value.placeValueInCell(
      props.candidate.getCell().getCellIdx(),
      props.candidate.getDigit(),
    );
  } else {
    sudoku.value.setCandidate(props.candidate, !props.candidate.getState());
  }
}
</script>

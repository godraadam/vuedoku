<template>
  <div
    :class="`aspect-square min-w-10 md:min-w-22 p-0.5 lg:p-2 flex group relative items-center justify-center border border-gray-300 group${isAtBottomEdge ? ' border-b-gray-700' : ''}${isAtTopEdge ? ' border-t-gray-700' : ''}${isAtLeftEdge ? ' border-l-gray-700' : ''}${isAtRightEdge ? ' border-r-gray-700' : ''}${isFocused ? ' bg-theme-200' : ''}${focusedCellSharedUnitCount == 2 ? ' bg-theme-100' : ''}${focusedCellSharedUnitCount == 1 ? ' bg-theme-50' : ''}`"
  >
    <div
      v-if="cell.isFilled()"
      class="text-2xl md:text-5xl font-semibold"
      :class="cell.isGiven() ? 'text-gray-900' : 'text-theme-600'"
    >
      {{ cell.getValue() + 1 }}
      <div v-if="isConflicting" class="absolute bottom-2 left-2 bg-red-400 rounded-full size-2 md:size-4" />
    </div>
    <div v-else class="h-full w-full grid grid-cols-3 grid-rows-3 gap-0.5">
      <Candidate
        v-for="candidate of cell.getCandidates()"
        :candidate
        :key="candidate.getCandidateIdx()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type CellModel from "@/model/Cell";
import Candidate from "@/components/Candidate.vue";
import useState from "@/composables/useState";

const props = defineProps<{
  cell: CellModel;
}>();

const { focusedCell, conflictingCells } = useState();

const isAtLeftEdge = computed(() => props.cell.getColIdx() % 3 == 0);
const isAtRightEdge = computed(() => props.cell.getColIdx() == 8);
const isAtTopEdge = computed(() => props.cell.getRowIdx() % 3 == 0);
const isAtBottomEdge = computed(() => props.cell.getRowIdx() == 8);
const isConflicting = computed(() =>
  conflictingCells.value.some((cell) => props.cell.equals(cell)),
);

const isFocused = computed(() => props.cell.equals(focusedCell.value));
const focusedCellSharedUnitCount = computed(() =>
  (["row", "col", "box"] as const).reduce(
    (count, unitType) =>
      props.cell.getUnitIdx(unitType) == focusedCell.value.getUnitIdx(unitType) ? count + 1 : count,
    0,
  ),
);
</script>

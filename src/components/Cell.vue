<template>
  <div :class="cn(
    'group relative flex size-11 items-center justify-center border border-gray-300 p-0.5 md:size-20 lg:p-2',
    cellHoverClass,
    borderClass,
  )
    " @mouseenter="focusedCell = cell" @click="focusedCell = cell">
    <div v-if="cell.isFilled()"
      class="font-satoshi z-10 flex h-full w-full items-center justify-center text-2xl font-semibold md:text-5xl"
      :class="cell.isGiven() ? 'text-gray-900' : 'text-theme-600'" @dblclick="handleDoubleClick">
      {{ cell.getValue() + 1 }}
      <div v-if="isConflicting" class="absolute bottom-2 left-2 size-2 rounded-full bg-red-400 md:size-4" />
    </div>
    <div v-else class="grid h-full w-full grid-cols-3 grid-rows-3 gap-0.5">
      <Candidate v-for="candidate of cell.getCandidates()" :candidate :key="candidate.getCandidateIdx()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type CellModel from "@/model/Cell";
import Candidate from "@/components/Candidate.vue";
import useState from "@/composables/useState";
import { cn } from "@/util";

const props = defineProps<{
  cell: CellModel;
}>();

const { focusedCell, conflictingCells, highlightedDigit } = useState();

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

const cellHoverClass = computed(() =>
  isFocused.value
    ? "bg-theme-200"
    : focusedCellSharedUnitCount.value == 2
      ? "bg-theme-100"
      : focusedCellSharedUnitCount.value == 1
        ? "bg-theme-50"
        : "",
);

const borderClass = computed(
  () =>
    `${isAtBottomEdge.value ? " border-b-gray-700" : ""}${isAtTopEdge.value ? " border-t-gray-700" : ""}${isAtLeftEdge.value ? " border-l-gray-700" : ""}${isAtRightEdge.value ? " border-r-gray-700" : ""}`,
);

function handleDoubleClick() {
  if (highlightedDigit.value == props.cell.getValue()) {
    highlightedDigit.value = undefined;
  } else {
    highlightedDigit.value = props.cell.getValue();
  }
}
</script>

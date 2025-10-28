<template>
  <div v-if="running || isSolved" class="grid grid-cols-9 grid-rows-9 w-full">
    <Cell v-for="cell of cells" :key="cell.getCellIdx()" :cell />
  </div>
  <div v-else class="grid grid-cols-9 grid-rows-9 w-full relative">
    <div
      v-for="i of cells.length"
      :key="i"
      class="aspect-square min-w-10 md:min-w-22 p-0.5 lg:p-2 border border-transparent data-[top=true]:border-t-gray-500 data-[left=true]:border-l-gray-500 data-[bottom=true]:border-b-gray-500 data-[right=true]:border-r-gray-500"
      :data-top="Math.floor((i - 1) / 9) == 0"
      :data-left="Math.floor((i - 1) % 9) == 0"
      :data-bottom="Math.floor((i - 1) / 9) == 8"
      :data-right="Math.floor((i - 1) % 9) == 8"
    />
    <PauseIcon
      class="absolute text-gray-900 size-32 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"
      @click="running = true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

import Cell from "@/components/Cell.vue";
import { useKeyboardEvent } from "@/composables/useKeyboardEvent";
import useState from "@/composables/useState";
import PauseIcon from "@/components/ui/icons/pause.svg";

const {
  focusedCell,
  sudoku,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sudokuSolver: _,
  running,
  isSolved,
  autoHighlight,
  highlightedDigit,
} = useState();

const cells = computed(() => sudoku.value.getCells());

watch(focusedCell, () => {
  if (autoHighlight.value) {
    highlightedDigit.value = focusedCell.value.getValue();
  }
});

useKeyboardEvent(
  (e) => {
    if (
      e.shiftKey &&
      [
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
      ].includes(e.code)
    ) {
      const candidate = focusedCell.value.getCandidate(Number(e.code.replace("Digit", "")) - 1);
      return sudoku.value.setCandidate(candidate, !candidate.isSet());
    }
    if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
      return sudoku.value.placeValueInCell(focusedCell.value.getCellIdx(), Number(e.key) - 1);
    }
    if (e.key == "Backspace" && !focusedCell.value.isGiven() && focusedCell.value.isFilled()) {
      return sudoku.value.removeValueFromCell(focusedCell.value.getCellIdx());
    }
    if (e.key == "ArrowRight") {
      if (e.metaKey) {
        return (focusedCell.value = sudoku.value.getLastNeighborOfCell(focusedCell.value, "right"));
      }
      if (e.altKey) {
        return (focusedCell.value = sudoku.value.getFirstUnsolvedNeighborOfCell(
          focusedCell.value,
          "right",
        ));
      }
      return (focusedCell.value = sudoku.value.getNeighborOfCell(focusedCell.value, "right"));
    }
    if (e.key == "ArrowLeft") {
      if (e.metaKey) {
        return (focusedCell.value = sudoku.value.getLastNeighborOfCell(focusedCell.value, "left"));
      }
      if (e.altKey) {
        return (focusedCell.value = sudoku.value.getFirstUnsolvedNeighborOfCell(
          focusedCell.value,
          "left",
        ));
      }
      return (focusedCell.value = sudoku.value.getNeighborOfCell(focusedCell.value, "left"));
    }
    if (e.key == "ArrowDown") {
      if (e.metaKey) {
        return (focusedCell.value = sudoku.value.getLastNeighborOfCell(focusedCell.value, "down"));
      }
      if (e.altKey) {
        return (focusedCell.value = sudoku.value.getFirstUnsolvedNeighborOfCell(
          focusedCell.value,
          "down",
        ));
      }
      return (focusedCell.value = sudoku.value.getNeighborOfCell(focusedCell.value, "down"));
    }
    if (e.key == "ArrowUp") {
      if (e.metaKey) {
        return (focusedCell.value = sudoku.value.getLastNeighborOfCell(focusedCell.value, "up"));
      }
      if (e.altKey) {
        return (focusedCell.value = sudoku.value.getFirstUnsolvedNeighborOfCell(
          focusedCell.value,
          "up",
        ));
      }
      return (focusedCell.value = sudoku.value.getNeighborOfCell(focusedCell.value, "up"));
    }
  },
  { preventDefault: true },
);
</script>

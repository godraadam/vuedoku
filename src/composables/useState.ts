import { computed, ref, type Ref } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { useRoute } from "vue-router";

import Sudoku from "@/model/Sudoku";
import { SudokuSolver } from "@/model/SudokuSolver";
import type Cell from "@/model/Cell";
import { useTimer } from "@/composables/useTimer";

function useState() {
  const route = useRoute();
  const input = computed(() => route.params.input as string | undefined);
  const values = computed(() => input.value?.split("").map((c) => Number(c) - 1));

  const autoCandidates = ref(true);
  const autoHint = ref(false);
  const running = ref(true);
  const { time, reset: resetTimer } = useTimer(running);

  const sudoku = ref(new Sudoku(values.value, { autoCandidate: true }));

  const sudokuSolver = computed(() => new SudokuSolver(sudoku.value as Sudoku));

  const conflictingCells = computed(() => {
    const res = sudoku.value?.validateState();
    return res.valid ? [] : res.conflicts;
  });

  const candidateToPlace = computed(() =>
    nextStep.value?.type == "place" ? nextStep.value.place : undefined,
  );

  const candidatesToRemove = computed(() =>
    nextStep.value?.type == "eliminate" ? nextStep.value.candidates : [],
  );

  const eliminationParticipants = computed(() =>
    nextStep.value?.type == "eliminate" ? (nextStep.value.participants ?? []) : [],
  );

  const isSolved = computed(() => sudoku.value.isProperSolved());
  const nextStep = computed(() => sudokuSolver.value.getNextStep());
  const focusedCell = ref(sudoku.value.getCellByIdx(0)) as Ref<Cell>;

  function reset() {
    sudoku.value = new Sudoku(values.value, { autoCandidate: true });
    resetTimer();
    running.value = true;
  }

  return {
    sudoku,
    candidateToPlace,
    candidatesToRemove,
    eliminationParticipants,
    conflictingCells,
    focusedCell,
    isSolved,
    nextStep,
    autoCandidates,
    autoHint,
    running,
    time,
    input,
    reset,
  };
}

export default createSharedComposable(useState);

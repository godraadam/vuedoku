import { expect, test, describe } from "vitest";

import { SudokuSolver } from "../src/model/SudokuSolver";
import Sudoku from "../src/model/Sudoku";
import easySudokus from "../src/sudokus/easy";
import mediumSudokus from "../src/sudokus/medium";
import hardSudokus from "../src/sudokus/hard";
import diabolicalSudokus from "../src/sudokus/diabolical";

describe.concurrent.skip(
  "Solves easy sudokus",
  () => {
    test.each(easySudokus.slice(0, 1000))("solves puzzle %s", (input) => {
      const values = input.split("").map((d) => Number(d) - 1);
      const sudoku = new Sudoku(values, { autoCandidate: true });
      const sudokuSolver = new SudokuSolver(sudoku);
      sudokuSolver.solve();

      const state = sudoku.getState();
      expect(state).toBe("solved");
    });
  },
  15000,
);

describe.concurrent.skip(
  "Solves medium sudokus",
  () => {
    test.each(mediumSudokus.slice(0, 1000))("solves puzzle %s", (input) => {
      const values = input.split("").map((d) => Number(d) - 1);
      const sudoku = new Sudoku(values, { autoCandidate: true });
      const sudokuSolver = new SudokuSolver(sudoku);
      sudokuSolver.solve();

      const state = sudoku.getState();
      expect(state).toBe("solved");
    });
  },
  15000,
);

describe.concurrent(
  "Solves hard sudokus",
  () => {
    test.each(hardSudokus.slice(0, 2000))("solves puzzle %s", (input) => {
      const values = input.split("").map((d) => Number(d) - 1);
      const sudoku = new Sudoku(values, { autoCandidate: true });
      const sudokuSolver = new SudokuSolver(sudoku);
      sudokuSolver.solve();

      const state = sudoku.getState();
      expect(state).toBe("solved");
    });
  },
  1000 * 60 * 5,
);

describe.concurrent(
  "Solves diabolical sudokus",
  () => {
    test.each(diabolicalSudokus.slice(0, 200))("solves puzzle %s", (input) => {
      const values = input.split("").map((d) => Number(d) - 1);
      const sudoku = new Sudoku(values, { autoCandidate: true });
      const sudokuSolver = new SudokuSolver(sudoku);
      sudokuSolver.solve();

      const state = sudoku.getState();
      expect(state).toBe("solved");
    });
  },
  1000 * 60 * 5,
);

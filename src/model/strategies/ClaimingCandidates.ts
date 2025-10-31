import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits } from "@/util";

export class ClaimingCandidates extends AbstractStrategy {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    // for each digit
    for (const digit of digits()) {
      const unitTypes = ["col", "row"] as const;
      for (const unitType of unitTypes) {
        // for each row and column
        for (const unit of this.sudoku.units(unitType)) {
          const boxIdxs = new Set<number>();
          unit.getCells().forEach((cell) => {
            if (cell.hasCandidate(digit)) {
              boxIdxs.add(cell.getBoxIdx());
            }
          });

          // check candidates are all in same box
          if (boxIdxs.size > 1) {
            continue;
          }
          // check there is anything to remove
          const boxIdx = boxIdxs.values().next().value!;
          const box = this.sudoku.getBox(boxIdx);
          const candidates = box
            .getCells()
            .filter((cell) => !unit.includesCell(cell) && cell.hasCandidate(digit))
            .map((cell) => cell.getCandidate(digit));

          if (candidates.length > 0) {
            const participants = box
              .getCells()
              .filter((cell) => unit.includesCell(cell) && cell.hasCandidate(digit))
              .map((cell) => cell.getCandidate(digit));
            return {
              reporter: this,
              type: "eliminate",
              candidates,
              participants,
              reason: `${this.getName()} ${
                digit + 1
              } in ${unit.getDisplay()} ${unit.getIdx() + 1}, box ${boxIdx + 1} `,
            };
          }
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return "Claiming candidates";
  }

  public getDifficultyScore() {
    return 2.5;
  }

  public getLink(): string | undefined {
    return "https://www.taupierbw.be/SudokuCoach/SC_BoxReduction.shtml";
  }
}

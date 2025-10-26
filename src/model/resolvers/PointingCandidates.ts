import { Resolver } from "@/model/resolvers/AbstractResolver";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits } from "@/util";

export class PointingCandidates extends Resolver {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    const unitTypes = ["row", "col"] as const;
    // for each box
    for (const box of this.sudoku.boxes()) {
      // for rows and columns

      // for each digit
      for (const digit of digits()) {
        for (const unitType of unitTypes) {
          const unitIdxs = new Set<number>();

          box.getCells().forEach((cell) => {
            if (cell.hasCandidate(digit)) {
              unitIdxs.add(cell.getUnitIdx(unitType));
            }
          });

          // if in a box a candidate is contained within a single row
          // or column, eliminate candidate from row/column outside the box
          if (unitIdxs.size == 1) {
            // check if there is anything to eliminate
            const unitIdx = unitIdxs.values().next().value!;
            const candidates = this.sudoku
              .getUnit(unitType, unitIdx)
              .getCells()
              .filter((cell) => !box.includesCell(cell) && cell.hasCandidate(digit))
              .map((cell) => cell.getCandidate(digit));

            if (candidates.length > 0) {
              const participants = box
                .getCells()
                .filter((cell) => cell.getUnitIdx(unitType) == unitIdx && cell.hasCandidate(digit))
                .map((cell) => cell.getCandidate(digit));
              return {
                type: "eliminate",
                candidates,
                participants,
                reason: `${this.getName()} ${digit + 1} in box ${
                  box.getIdx() + 1
                }, ${unitType} ${unitIdx + 1}`,
              };
            }
          }
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return "Pointing candidates";
  }
}

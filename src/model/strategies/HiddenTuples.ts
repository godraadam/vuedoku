import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { getTupleName, kCombinations } from "@/util";

export class HiddenTupleResolver extends AbstractStrategy {
  private tupleSize: number;

  constructor(sudoku: Sudoku, tupleSize: number) {
    super(sudoku);
    this.tupleSize = tupleSize;
  }

  public resolve(): Step | undefined {
    const unitTypes = ["row", "col", "box"] as const;
    // for each unit
    for (const unitType of unitTypes) {
      for (const unit of this.sudoku.units(unitType)) {
        const digitCounts = unit.getCountsOfCandidates();

        // find candidates that occur exactly N times in unit
        const candidateDigits = digitCounts
          .filter(({ count }) => count <= this.tupleSize && count >= 1)
          .map(({ digit }) => digit);

        // no hidden tuple in this unit, try next ones
        if (candidateDigits.length < this.tupleSize) {
          continue;
        }

        // for any possible N-tuple
        for (const tuple of kCombinations(candidateDigits, this.tupleSize)) {
          // find cells where these candidates occur
          const candidateCells = unit
            .getCells()
            .filter((cell) => tuple.some((digit) => cell.hasCandidate(digit)));

          // if elements of N-tuple occurs in a total of N cells, it's a hidden N-tuple
          if (candidateCells.length == this.tupleSize) {
            // hidden singles can be placed
            if (this.tupleSize == 1) {
              return {
                reporter: this,
                type: "place",
                reason: `${this.getName()} ${tuple.at(0)! + 1} in ${unit.getDisplay()} ${unit.getIdx() + 1} `,
                place: candidateCells.at(0)!.getCandidate(tuple.at(0)!),
              };
            }

            // check if there is anything to remove
            const candidates = candidateCells
              .map((cell) => cell.getSetCandidates())
              .flat()
              .filter((c) => !tuple.includes(c.getDigit()));

            if (candidates.length > 0) {
              const participants = candidateCells
                .map((cell) => cell.getSetCandidates())
                .flat()
                .filter((cand) => tuple.includes(cand.getDigit()));
              return {
                reporter: this,
                type: "eliminate",
                candidates,
                participants,
                reason: `${this.getName()} ${tuple
                  .map((d) => d + 1)
                  .join(", ")} in ${unit.getDisplay()} ${unit.getIdx() + 1}`,
              };
            }
          }
        }
      }
    }
    return undefined;
  }

  public getDifficultyScore() {
    if (this.tupleSize == 1) return 1.5;
    if (this.tupleSize == 2) return 2;
    if (this.tupleSize == 3) return 2.5;
    if (this.tupleSize == 4) return 3.5;
    if (this.tupleSize == 5) return 4.5;
    return 6;
  }

  public getName(): string {
    return `Hidden ${getTupleName(this.tupleSize)}`;
  }

  public getLink() {
    if (this.tupleSize == 1) {
      return "https://www.taupierbw.be/SudokuCoach/SC_Singles.shtml";
    }
    if (this.tupleSize == 2) {
      return "https://www.taupierbw.be/SudokuCoach/SC_HiddenPairs.shtml";
    }
    if (this.tupleSize == 3) {
      return "https://www.taupierbw.be/SudokuCoach/SC_HiddenTriples.shtml";
    }
    if (this.tupleSize == 4) {
      return "https://www.taupierbw.be/SudokuCoach/SC_HiddenQuads.shtml";
    }
    return undefined;
  }
}

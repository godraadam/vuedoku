import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import { Group } from "@/model/Group";
import { getTupleName, kCombinations } from "@/util";
import type { Step } from "@/types";

export class NakedTupleResolver extends AbstractStrategy {
  private tupleSize: number;

  constructor(sudoku: Sudoku, tupleSize: number) {
    super(sudoku);
    this.tupleSize = tupleSize;
  }

  public resolve(): Step | undefined {
    // for each unit
    const unitTypes = ["box", "row", "col"] as const;
    for (const unitType of unitTypes) {
      for (const unit of this.sudoku.units(unitType)) {
        // get cells with less than tupleSize candidates
        const candidateCells = unit
          .getCells()
          .filter((cell) => !cell.isFilled() && cell.getCandidateCount() <= this.tupleSize);

        // get N-tuples of candidate cells
        for (const cells of kCombinations(candidateCells, this.tupleSize)) {
          const cellGroup = new Group(cells);

          // if candidate set size of group == N => Naked N-tuple
          if (cellGroup.isLockedSet()) {
            // naked singles can placed
            const value = cellGroup.getCandidateSet().at(0)!;
            if (cellGroup.getSize() == 1) {
              return {
                reporter: this,
                type: "place",
                reason: this.getName(),
                place: cells.at(0)!.getCandidate(value),
              };
            }

            const vals = cellGroup.getCandidateSet();
            // check if there is anything to remove
            const candidates = unit
              .getCells()
              .filter((cell) => !cellGroup.includesCell(cell))
              .map((cell) => cell.getSetCandidates())
              .flat()
              .filter((c) => vals.includes(c.getDigit()));

            if (candidates.length > 0) {
              const participants = cellGroup
                .getCells()
                .map((cell) => cell.getSetCandidates())
                .flat();

              return {
                reporter: this,
                type: "eliminate",
                candidates,
                participants,
                reason: `${this.getName()} of ${vals
                  .map((val) => val + 1)
                  .join(", ")} in ${unit.getDisplay()} ${unit.getIdx() + 1}`,
              };
            }
          }
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return `Naked ${getTupleName(this.tupleSize)}`;
  }

  public getDifficultyScore() {
    if (this.tupleSize == 1) return 1;
    if (this.tupleSize == 2) return 1.5;
    if (this.tupleSize == 3) return 2;
    if (this.tupleSize == 4) return 3;
    return 4;
  }

  public getLink() {
    if (this.tupleSize == 1) {
      return "https://www.taupierbw.be/SudokuCoach/SC_Singles.shtml";
    }
    if (this.tupleSize == 2) {
      return "https://www.taupierbw.be/SudokuCoach/SC_NakedPairs.shtml";
    }
    if (this.tupleSize == 3) {
      return "https://www.taupierbw.be/SudokuCoach/SC_NakedTriples.shtml";
    }
    if (this.tupleSize == 4) {
      return "https://www.taupierbw.be/SudokuCoach/SC_NakedQuads.shtml";
    }
    return undefined;
  }
}

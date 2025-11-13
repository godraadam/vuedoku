import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type Cell from "@/model/Cell";
import type { Step } from "@/types";

export class BUG extends AbstractStrategy {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    let bugCell: Cell | undefined = undefined;
    for (const cell of this.sudoku.cells()) {
      if (cell.getCandidateCount() > 3) {
        return undefined;
      }
      if (cell.getCandidateCount() == 3) {
        if (!bugCell) {
          bugCell = cell;
        } else {
          return undefined;
        }
      }
    }
    if (!bugCell) {
      return undefined;
    }
    // find value of bug cell
    for (const candidate of bugCell?.getCandidateList()) {
      const unitTypes = ["box", "row", "col"] as const;
      for (const unitType of unitTypes) {
        const unit = this.sudoku.getUnit(unitType, bugCell.getUnitIdx(unitType));
        const candidateCountInUnit = unit.getCountOfCandidate(candidate);
        if (candidateCountInUnit % 2 == 1) {
          return {
            reporter: this,
            type: "place",
            place: bugCell.getCandidate(candidate),
            participants: bugCell.getSetCandidates(),
            reason: `Removing ${candidate + 1} from ${bugCell.toString()} causes a Bi-Value Universal Grave`,
          };
        }
      }
    }
  }

  public getName(): string {
    return `Bi-Value Universal Grave`;
  }

  public getDifficultyScore() {
    return 2;
  }

  public getLink() {
    return "https://www.taupierbw.be/SudokuCoach/SC_BUG.shtml";
  }
}

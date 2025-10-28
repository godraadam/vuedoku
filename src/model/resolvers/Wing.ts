import { Resolver } from "@/model/resolvers/AbstractResolver";
import type Sudoku from "@/model/Sudoku";
import { Group } from "@/model/Group";
import type { Step } from "@/types";
import { kCombinations } from "@/util";

export class Wing extends Resolver {
  private order: number;
  constructor(sudoku: Sudoku, order: number) {
    super(sudoku);
    this.order = order;
  }

  public resolve(): Step | undefined {
    const pivots = this.sudoku
      .getCells()
      .filter((cell) => cell.getCandidateCount() <= this.order && cell.getCandidateCount() > 1);

    for (const pivot of pivots) {
      // find pincers
      const seenCells = this.sudoku.getCellsSeenBy(pivot);
      const pincerCandidates = seenCells.filter(
        (cell) => cell.getCandidateCount() <= this.order && cell.getCandidateCount() > 1,
      );
      if (pincerCandidates.length < this.order - 1) {
        continue;
      }
      // for any combination of pincers
      for (const pincers of kCombinations(pincerCandidates, this.order - 1)) {
        const group = new Group([pivot, ...pincers]);
        if (group.getCandidateCount() != this.order) {
          continue;
        }
        const nonRestictedCommons = group.getNonRestrictedCommons();
        if (nonRestictedCommons.length != 1) {
          continue;
        }
        const z = nonRestictedCommons.at(0)!;

        // find candidates z in cells that see all cells of the group
        const candidates = this.sudoku
          .getAllSetCandidates()
          .filter((c) => c.getDigit() == z)
          .filter((c) => !group.includesCell(c.getCell()))
          .filter((c) =>
            group
              .getCells()
              .filter((cell) => cell.hasCandidate(z))
              .every((cell) => c.getCell().canSee(cell)),
          );

        if (candidates.length > 0) {
          const participants = group
            .getCells()
            .map((cell) => cell.getSetCandidates())
            .flat();
          return {
            type: "eliminate",
            reason: `${this.getName()}; z=${z + 1}. Pivot cell (${pivot.getRowIdx() + 1}, ${
              pivot.getColIdx() + 1
            })`,
            candidates,
            participants,
          };
        }
      }
    }

    return undefined;
  }

  public getName(): string {
    if (this.order == 3) return "XYZ-Wing";
    if (this.order == 4) return "WXYZ-Wing";
    if (this.order == 5) return "UWXYZ-Wing";
    return "";
  }
}

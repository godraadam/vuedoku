import { Resolver } from "@/model/resolvers/AbstractResolver";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { kCombinations } from "@/util";

export class XYZWing extends Resolver {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    // for all pivot cells with candidate XY
    const pivotCandidates = this.sudoku.getCells().filter((cell) => cell.getCandidateCount() == 3);

    for (const pivot of pivotCandidates) {
      const [x, y, z] = pivot.getCandidateList();
      // try to find pincers with XZ, YZ
      const seenCells = this.sudoku.getCellsSeenBy(pivot);
      const pincerCandidates = seenCells.filter(
        (cell) =>
          cell.getCandidateCount() == 2 &&
          cell.getCandidateList().every((c) => [x, y, z].includes(c)),
      );
      if (pincerCandidates.length < 2) {
        continue;
      }
      for (const [pincerA, pincerB] of kCombinations(pincerCandidates, 2)) {
        // find pincer with X
        if (pincerA.hasSameCandidatesAs(pincerB)) {
          continue;
        }
        const value = pivot
          .getCandidateList()
          .find((c) => pincerA.hasCandidate(c) && pincerB.hasCandidate(c))!;
        // any cell that sees both pincers
        const cellsSeenByPincer1 = this.sudoku.getCellsSeenBy(pincerA);
        const cellsSeenByPincer2 = this.sudoku.getCellsSeenBy(pincerB);
        const cellsSeenByPivot = this.sudoku.getCellsSeenBy(pivot);
        // get intersection
        const candidates = cellsSeenByPincer1
          .filter(
            (cell) =>
              cellsSeenByPincer2.map((_cell) => _cell.getCellIdx()).includes(cell.getCellIdx()) &&
              cellsSeenByPivot.map((_cell) => _cell.getCellIdx()).includes(cell.getCellIdx()),
          )
          .filter((cell) => cell.hasCandidate(value))
          .map((cell) => cell.getCandidate(value))
          .flat();
        if (candidates.length > 0) {
          const participants = [
            ...pincerA.getSetCandidates(),
            ...pincerB.getSetCandidates(),
            ...pivot.getSetCandidates(),
          ];
          return {
            type: "eliminate",
            reason: `${this.getName()}; x = ${x + 1}, y = ${y + 1}, z=${
              z + 1
            }. Pivot cell (${pivot.getRowIdx() + 1}, ${
              pivot.getColIdx() + 1
            }), pincer cells (${pincerA.getRowIdx() + 1}, ${
              pincerA.getColIdx() + 1
            }), (${pincerB.getRowIdx() + 1}, ${pincerB.getColIdx() + 1})`,
            candidates,
            participants,
          };
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return "XYZ Wing";
  }
}

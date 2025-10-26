import { Resolver } from "@/model/resolvers/AbstractResolver";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { kCombinations } from "@/util";

export class XYWing extends Resolver {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    const pivotCandidates = this.sudoku.getCells().filter((cell) => cell.getCandidateCount() == 2);

    for (const pivot of pivotCandidates) {
      const [x, y] = pivot.getCandidateList();
      // try to find pincers with XZ, YZ
      const seenCells = this.sudoku.getCellsSeenBy(pivot);
      const pincerCandidates = seenCells.filter(
        (cell) => cell.getCandidateCount() == 2 && (cell.hasCandidate(x) || cell.hasCandidate(y)),
      );
      if (pincerCandidates.length < 2) {
        continue;
      }
      for (const [pincerA, pincerB] of kCombinations(pincerCandidates, 2)) {
        // find pincer with X

        if (pincerA.hasSameCandidatesAs(pincerB)) {
          continue;
        }

        const xPincer = pincerA.hasCandidate(x) ? pincerA : pincerB;
        const yPincer = pincerA.hasCandidate(y) ? pincerA : pincerB;
        const z = xPincer.getCandidateList().find((c) => c != x)!;
        if (z != x && z != y && xPincer.hasCandidate(z) && yPincer.hasCandidate(z)) {
          // any cell that sees both pincers
          const cellsSeenByPincer1 = this.sudoku.getCellsSeenBy(xPincer);
          const cellsSeenByPincer2 = this.sudoku.getCellsSeenBy(yPincer);
          // get intersection
          const candidates = cellsSeenByPincer1
            .filter((cell) =>
              cellsSeenByPincer2.map((_cell) => _cell.getCellIdx()).includes(cell.getCellIdx()),
            )
            .filter((cell) => cell.hasCandidate(z))
            .map((cell) => cell.getCandidate(z))
            .flat();
          if (candidates.length > 0) {
            const participants = [
              ...xPincer.getSetCandidates(),
              ...yPincer.getSetCandidates(),
              ...pivot.getSetCandidates(),
            ];
            return {
              type: "eliminate",
              reason: `${this.getName()}; x = ${x + 1}, y = ${y + 1}, z=${
                z + 1
              }. Pivot cell (${pivot.getRowIdx() + 1}, ${
                pivot.getColIdx() + 1
              }), pincer cells (${xPincer.getRowIdx() + 1}, ${
                xPincer.getColIdx() + 1
              }), (${yPincer.getRowIdx() + 1}, ${yPincer.getColIdx() + 1})`,
              candidates,
              participants,
            };
          }
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return "XY Wing";
  }
}

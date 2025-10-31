import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { kCombinations } from "@/util";

export class CPRResolver extends AbstractStrategy {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    const unitTypes = ["xchute", "ychute"] as const;
    for (const unitType of unitTypes) {
      // for each chute
      for (const chute of this.sudoku.units(unitType)) {
        // find remote pairs
        const candidateRemotePairs = chute
          .getCells()
          .filter((cell) => cell.getCandidateCount() == 2);
        // check each pair of candidate
        for (const [cellA, cellB] of kCombinations(candidateRemotePairs, 2)) {
          if (!cellA.canSee(cellB) && cellA.hasSameCandidatesAs(cellB)) {
            // chute remote pair found
            const blindSpotCells = chute
              .getCells()
              .filter((cell) => !cellA.canSee(cell) && !cellB.canSee(cell));
            // if blindspot contains at most one *digit* (candidate or value) of the two
            const blindSpotDigitSet = new Set<number>();
            blindSpotCells.forEach((cell) =>
              cell.isFilled()
                ? blindSpotDigitSet.add(cell.getValue())
                : cell.getCandidateList().forEach((c) => blindSpotDigitSet.add(c)),
            );
            const vals = cellA.getCandidateList().filter((d) => blindSpotDigitSet.has(d));
            if (vals.length != 1) {
              continue;
            }
            // check if there is anything to eliminate
            const candidates = this.sudoku
              .getCellsSeenBy(cellA)
              .filter((cell) => cellB.canSee(cell) && cell.hasCandidate(vals[0]))
              .map((cell) =>
                cell.getSetCandidates().filter((cand) => vals.includes(cand.getDigit())),
              )
              .flat();
            if (candidates.length > 0) {
              const participants = [...cellA.getSetCandidates(), ...cellB.getSetCandidates()];
              return {
                reporter: this,
                type: "eliminate",
                reason: `${this.getName()} (${cellA
                  .getCandidateList()
                  .map((d) => d + 1)
                  .join(", ")}) in ${chute.getDisplay()} ${chute.getIdx() + 1}`,
                candidates,
                participants,
              };
            }
          }
        }
      }
    }

    return undefined;
  }

  public getName(): string {
    return "Chute remote pair";
  }

  public getDifficultyScore() {
    return 3.5;
  }

  public getLink(): string | undefined {
    return "https://www.taupierbw.be/SudokuCoach/SC_ChuteRemotePairs.shtml";
  }
}

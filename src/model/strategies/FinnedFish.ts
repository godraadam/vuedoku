import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits, kCombinations } from "@/util";

// WIP
export class FinnedFishResolver extends AbstractStrategy {
  private order: number;

  constructor(sudoku: Sudoku, order: number) {
    super(sudoku);
    this.order = order;
  }

  public resolve(): Step | undefined {
    // for rows and then columns
    const unitTypes = ["row", "col"] as const;
    for (const unitType of unitTypes) {
      // for each digit
      for (const digit of digits()) {
        // for all n tuple of rows/columns
        const units = this.sudoku.getUnits(unitType);
        for (const unitKTuple of kCombinations(units, this.order)) {
          const unitToCellsWithCandidate = unitKTuple.map((_unit) =>
            _unit.getCellsWithCandidate(digit),
          );
          // we allow more than <order> nr of candidates in a unit, these will be our fins
          if (unitToCellsWithCandidate.some((cells) => cells.length < 1)) {
            continue;
          }
          // but how??
          const diagonalUnitType = unitType == "row" ? "col" : "row";
          const diagonalUnitIdxSet = unitToCellsWithCandidate
            .map((cells) => cells.map((cell) => cell.getUnitIdx(diagonalUnitType)))
            .flat()
            .reduce((set, idx) => set.add(idx), new Set<number>());

          // we need to check fins are located within one box
          if (diagonalUnitIdxSet.size == this.order) {
            // check if there is anything to remove
            const diagonalUnits = Array.from(diagonalUnitIdxSet).map((idx) =>
              this.sudoku.getUnit(diagonalUnitType, idx),
            );
            const candidates = diagonalUnits
              .map((unit) =>
                unit
                  .getCells()
                  .filter(
                    (cell) =>
                      !unitKTuple
                        .map((unit) => unit.getIdx())
                        .includes(cell.getUnitIdx(unitType)) && cell.hasCandidate(digit),
                  ),
              )
              .flat()
              .map((cell) => cell.getSetCandidates().filter((cand) => cand.getDigit() == digit))
              .flat();
            if (candidates.length > 0) {
              const participants = unitToCellsWithCandidate
                .map((unit) => unit.map((cell) => cell.getCandidate(digit)))
                .flat();
              return {
                reporter: this,
                type: "eliminate",
                reason: `${this.getName()} with ${digit + 1}, ${units[0].getDisplay()}s ${unitKTuple
                  .map((_unit) => _unit.getIdx() + 1)
                  .join(", ")} and ${diagonalUnits[0].getDisplay()}s ${diagonalUnits
                  .map((_unit) => _unit.getIdx() + 1)
                  .join(", ")}`,
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
    const nameMap = {
      2: "Finned X-Wing",
      3: "Finned Swordfish",
      4: "Finned Jellyfish",
      5: "Finned Squirmbag",
    };
    return nameMap[this.order as keyof typeof nameMap];
  }

  public getDifficultyScore() {
    if (this.order == 2) return 4;
    if (this.order == 3) return 5;
    if (this.order == 4) return 6;
    if (this.order == 5) return 7;
    return 8;
  }

  public getLink(): string | undefined {
    return undefined;
  }
}

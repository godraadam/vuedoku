import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits, kCombinations, subsets } from "@/util";

// WIP
export class FinnedFish extends AbstractStrategy {
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
        // for all n-tuples of rows/columns with at most <order> + 2 occurences of <digit> as candidate
        const units = this.sudoku
          .getUnits(unitType)
          .filter(
            (unit) =>
              unit.getCountOfCandidate(digit) <= this.order + 2 &&
              unit.getCountOfCandidate(digit) > 1,
          );

        for (const unitKTuple of kCombinations(units, this.order)) {
          const finnedUnits = unitKTuple.filter(
            (unit) => unit.getCountOfCandidate(digit) > this.order,
          );
          // if more than 1 row/column contains more candidate cells then <order>, skip
          if (finnedUnits.length > 1) {
            continue;
          }

          // for order > 2 we don't know which unit is finned
          // nominate each as finned unit and test
          for (const maybeFinnedUnit of unitKTuple) {
            // try each subset of candidate finned unit's cells
            const candidateCells = maybeFinnedUnit.getCellsWithCandidate(digit);
            for (const fishCells of subsets(candidateCells, this.order)) {
              const finCells = candidateCells.filter((cell) => !fishCells.includes(cell));

              // try to make a proper fish with selected cells

              const unitToCellsWithCandidate = unitKTuple.map((_unit) =>
                _unit.getIdx() == maybeFinnedUnit.getIdx()
                  ? fishCells
                  : _unit.getCellsWithCandidate(digit),
              );
              const diagonalUnitType = unitType == "row" ? "col" : "row";
              const diagonalUnitIdxSet = unitToCellsWithCandidate
                .map((cells) => cells.map((cell) => cell.getUnitIdx(diagonalUnitType)))
                .flat()
                .reduce((set, idx) => set.add(idx), new Set<number>());

              if (diagonalUnitIdxSet.size != this.order) {
                continue;
              }

              // check that fin cells are valid
              const finCellsBoxIds = Array.from(
                finCells.reduce(
                  (boxIdSet, cell) => boxIdSet.add(cell.getBoxIdx()),
                  new Set<number>(),
                ),
              );

              if (
                finCellsBoxIds.length > 1 ||
                candidateCells.every((cell) => cell.getBoxIdx() != finCellsBoxIds[0])
              ) {
                continue;
              }

              const diagonalUnits = Array.from(diagonalUnitIdxSet).map((idx) =>
                this.sudoku.getUnit(diagonalUnitType, idx),
              );
              const candidates = diagonalUnits
                .map((unit) =>
                  unit
                    .getCells()
                    .filter(
                      (cell) =>
                        cell.getBoxIdx() == finCellsBoxIds[0] &&
                        !unitKTuple
                          .map((unit) => unit.getIdx())
                          .includes(cell.getUnitIdx(unitType)) &&
                        cell.hasCandidate(digit),
                    ),
                )
                .flat()
                .map((cell) => cell.getCandidate(digit));

              // check there is anything to remove
              if (candidates.length < 1) {
                continue;
              }

              const participants = unitToCellsWithCandidate
                .map((unit) => unit.map((cell) => cell.getCandidate(digit)))
                .flat()
                .concat(finCells.map((cell) => cell.getCandidate(digit)));
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

  public getName() {
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

  public getLink() {
    if (this.order == 2) {
      return "https://www.taupierbw.be/SudokuCoach/SC_FinnedXWing.shtml";
    }
    if (this.order == 3) {
      return "https://www.taupierbw.be/SudokuCoach/SC_FinnedSwordfish.shtml";
    }
    if (this.order == 4) {
      return "https://www.taupierbw.be/SudokuCoach/SC_FinnedJellyfish.shtml";
    }
  }
}

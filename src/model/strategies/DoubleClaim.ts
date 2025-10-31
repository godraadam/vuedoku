import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits, kCombinations } from "@/util";

export class DoubleClaimResolver extends AbstractStrategy {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    // for each digit
    for (const digit of digits()) {
      const unitTypes = ["xchute", "ychute"] as const;
      for (const unitType of unitTypes) {
        // for each row and column
        const coverUnitType = unitType == "xchute" ? "row" : "col";
        for (const unit of this.sudoku.units(unitType)) {
          const boxes = this.sudoku.getBoxesOfChute(unit.getIdx(), unitType);
          for (const [boxA, boxB] of kCombinations(boxes, 2)) {
            const boxADigitUnitIdxs = boxA
              .getSetCandidatesOfDigit(digit)
              .reduce(
                (set, cand) => set.add(cand.getCell().getUnitIdx(coverUnitType)),
                new Set<number>(),
              );
            const boxBDigitUnitIdxs = boxB
              .getSetCandidatesOfDigit(digit)
              .reduce(
                (set, cand) => set.add(cand.getCell().getUnitIdx(coverUnitType)),
                new Set<number>(),
              );
            if (
              boxADigitUnitIdxs.size == 2 &&
              boxBDigitUnitIdxs.size == 2 &&
              Array.from(boxADigitUnitIdxs).every((idx) => boxBDigitUnitIdxs.has(idx))
            ) {
              const [boxC] = boxes.filter(
                (box) => box.getIdx() != boxA.getIdx() && box.getIdx() != boxB.getIdx(),
              );
              const candidates = boxC
                .getSetCandidatesOfDigit(digit)
                .filter((cand) => boxADigitUnitIdxs.has(cand.getCell().getUnitIdx(coverUnitType)));
              if (candidates.length > 0) {
                const participants = [
                  ...boxA.getSetCandidatesOfDigit(digit),
                  ...boxB.getSetCandidatesOfDigit(digit),
                ];
                return {
                  reporter: this,
                  type: "eliminate",
                  candidates,
                  participants,
                  reason: `${this.getName()} ${
                    digit + 1
                  } in ${unit.getDisplay()} ${unit.getIdx() + 1}, box ${boxA.getIdx() + 1} and box ${boxB.getIdx() + 1} `,
                };
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return "Double claim";
  }

  public getDifficultyScore() {
    return 2;
  }

  public getLink(): string | undefined {
    return undefined;
  }
}

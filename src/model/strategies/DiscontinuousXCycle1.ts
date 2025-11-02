import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import { InferenceGraphWalker } from "@/model/InferenceGraphWalker";
import type { Step } from "@/types";

export class DiscontinousXCycle1 extends AbstractStrategy {
  private targetLength: number;

  constructor(sudoku: Sudoku, targetLength: number) {
    super(sudoku);
    this.targetLength = targetLength;
  }

  public resolve(): Step | undefined {
    for (const digit of this.sudoku.digits()) {
      for (const candidate of this.sudoku.getAllSetCandidatesOfDigit(digit)) {
        const chainWalker = new InferenceGraphWalker(this.sudoku.getInferenceGraph());
        const chain = chainWalker.getChain(
          candidate,
          this.targetLength,
          "weak",
          true,
          true,
          (node) => node.getDigit() == digit,
        );
        if (chain) {
          return {
            reporter: this,
            type: "eliminate",
            reason: "X-Cycle",
            chain,
            candidates: [candidate],
            participants: [chain[0].from, ...chain.map((it) => it.to)],
          };
        }
      }
    }

    return undefined;
  }

  public getName() {
    return `Discontinuous X-Cycle type 1`;
  }

  public getDifficultyScore() {
    return 4.5;
  }

  public getLink() {
    return "https://www.taupierbw.be/SudokuCoach/SC_XCycle.shtml";
  }
}

import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import { InferenceGraphWalker } from "@/model/InferenceGraphWalker";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";

export class DiscontinousXYCycle1 extends AbstractStrategy {
  private targetLength: number;

  constructor(sudoku: Sudoku, targetLength: number) {
    super(sudoku);
    this.targetLength = targetLength;
  }

  public resolve(): Step | undefined {
    for (const candidate of this.sudoku.getAllSetCandidates()) {
      const chainWalker = new InferenceGraphWalker(this.sudoku.getInferenceGraph());
      const chain = chainWalker.getChain(
        candidate,
        this.targetLength,
        "strong",
        true,
        true,
        (node) => node.getCell().getCandidateCount() == 2,
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
    return undefined;
  }

  public getName() {
    return `Discontinuous XY-Cycle type 1`;
  }

  public getDifficultyScore() {
    return 5;
  }

  public getLink() {
    return "https://www.taupierbw.be/SudokuCoach/SC_XYChain.shtml";
  }
}

import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import { InferenceGraphWalker } from "@/model/InferenceGraphWalker";
import type Candidate from "@/model/Candidate";
import type { Step } from "@/types";

export class XCycleResolver extends AbstractStrategy {
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
          "strong",
          true,
          true,
          (node) => node.getDigit() == digit,
        );
        if (chain) {
          const weakLinks = chain.filter((it) => it.type == "weak");
          const candidates: Array<Candidate> = [];
          for (const link of weakLinks) {
            const cells = this.sudoku
              .getCellsSeenBy(link.from.getCell())
              .filter((cell) => cell.canSee(link.to.getCell()) && cell != link.to.getCell());

            const _candidates = cells
              .filter((cell) => cell.hasCandidate(digit))
              .map((cell) => cell.getCandidate(digit));
            candidates.push(..._candidates);
          }

          if (candidates.length > 0) {
            return {
              reporter: this,
              type: "eliminate",
              reason: "X-Cycle",
              chain,
              candidates,
              participants: [chain[0].from, ...chain.map((it) => it.to)],
            };
          }
        }
      }
    }

    return undefined;
  }

  public getName(): string {
    return `X-Cycle of length ${this.targetLength}`;
  }

  public getDifficultyScore() {
    return 4.5;
  }

  public getLink(): string | undefined {
    return "https://www.taupierbw.be/SudokuCoach/SC_XCycle.shtml";
  }
}

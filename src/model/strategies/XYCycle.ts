import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import { InferenceGraphWalker } from "@/model/InferenceGraphWalker";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import type Candidate from "@/model/Candidate";

export class XYCycleResolver extends AbstractStrategy {
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
        const weakLinks = chain
          .filter((it) => it.type == "weak")
          .filter((it) => it.from.getCell() != it.to.getCell());
        const candidates: Array<Candidate> = [];
        for (const link of weakLinks) {
          const cells = this.sudoku
            .getCellsSeenBy(link.from.getCell())
            .filter((cell) => cell.canSee(link.to.getCell()) && cell != link.to.getCell());

          const _candidates = cells
            .filter((cell) => cell.hasCandidate(link.from.getDigit()))
            .map((cell) => cell.getCandidate(link.from.getDigit()));
          candidates.push(..._candidates);
        }

        if (candidates.length > 0) {
          return {
            reporter: this,
            type: "eliminate",
            reason: this.getName(),
            chain,
            candidates,
            participants: [chain[0].from, ...chain.map((it) => it.to)],
          };
        }
      }
    }
    return undefined;
  }

  public getName(): string {
    return `XY-Cycle`;
  }

  public getDifficultyScore() {
    return 5;
  }

  public getLink(): string | undefined {
    return undefined;
  }
}

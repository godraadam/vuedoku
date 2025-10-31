import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import type Sudoku from "@/model/Sudoku";
import { InferenceGraphWalker } from "@/model/InferenceGraphWalker";
import type { Step } from "@/types";

export class XChainResolver extends AbstractStrategy {
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
          false,
          true,
          (node) => node.getDigit() == digit,
        );
        if (chain) {
          const startCell = chain.at(0)!.from.getCell();
          const endCell = chain.at(-1)!.to.getCell();
          const cellsSeenByBoth = this.sudoku
            .getCellsSeenBy(startCell)
            .filter((cell) => cell.canSee(endCell));

          const candidates = cellsSeenByBoth
            .filter((cell) => cell.hasCandidate(digit))
            .map((cell) => cell.getCandidate(digit))
            .filter((candidate) => !chain.some((it) => it.from == candidate || it.to == candidate));

          if (candidates.length > 0) {
            return {
              reporter: this,
              type: "eliminate",
              reason: "X-Chain",
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
    return `X-Chain of length ${this.targetLength}`;
  }

  public getDifficultyScore() {
    return 4.5;
  }

  public getLink(): string | undefined {
    return undefined;
  }
}

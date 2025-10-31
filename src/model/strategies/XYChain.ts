import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import { InferenceGraphWalker } from "@/model/InferenceGraphWalker";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";

export class XYChainResolver extends AbstractStrategy {
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
        false,
        true,
        (node) => node.getCell().getCandidateCount() == 2,
      );
      if (chain) {
        const startCell = chain.at(0)!.from.getCell();
        const endCell = chain.at(-1)!.to.getCell();
        const cellsSeenByBoth = this.sudoku
          .getCellsSeenBy(startCell)
          .filter((cell) => cell.canSee(endCell));

        const candidates = cellsSeenByBoth
          .filter((cell) => cell.hasCandidate(candidate.getDigit()))
          .map((cell) => cell.getCandidate(candidate.getDigit()))
          .filter((candidate) => !chain.some((it) => it.from == candidate || it.to == candidate));

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
    return `XY-Chain of length ${this.targetLength}`;
  }

  public getDifficultyScore() {
    return 5;
  }

  public getLink(): string | undefined {
    return "https://www.taupierbw.be/SudokuCoach/SC_XYChain.shtml";
  }
}

import { Resolver } from "@/model/resolvers/AbstractResolver";
import { InferenceGraph } from "@/model/InferenceChainGraph";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";

export class XYChainResolver extends Resolver {
  constructor(sudoku: Sudoku) {
    super(sudoku);
  }

  public resolve(): Step | undefined {
    const graph = new InferenceGraph(
      this.sudoku,
      this.sudoku.getAllSetCandidates().filter((cand) => cand.getCell().getCandidateCount() == 2),
    );

    for (const chain of graph.getChains("strong", 4)) {
      const start = chain.at(0)!.candidate;
      const end = chain.at(-1)!.candidate;
      const candidates = this.sudoku
        .getGroupSeenByCell(start.getCell())
        .getIntersection(this.sudoku.getGroupSeenByCell(end.getCell()))
        .getCellsWithCandidate(start.getDigit())
        .map((cell) => cell.getCandidate(start.getDigit()));

      if (candidates.length > 0) {
        return {
          type: "eliminate",
          reason: `${this.getName()}: ${chain.map((node) => `${node.candidate.getCell().toString()}${node.type == "strong" ? "<>" : "=="}${node.candidate.getDigit() + 1}`, "").join("=>")}`,
          candidates,
          participants: chain.map((it) => it.candidate),
        };
      }
    }

    return undefined;
  }

  public getName(): string {
    return "XY-Chain";
  }
}

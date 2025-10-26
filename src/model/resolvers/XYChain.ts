import { Resolver } from "@/model/resolvers/AbstractResolver";
import { InferenceGraph } from "@/model/InferenceChainGraph";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";

export class XYChainResolver extends Resolver {
  private graph: InferenceGraph;

  constructor(sudoku: Sudoku) {
    super(sudoku);
    this.graph = new InferenceGraph(this.sudoku);
  }

  public resolve(): Step | undefined {
    this.graph.build(
      this.sudoku.getAllSetCandidates().filter((c) => c.getCell().getCandidateCount() == 2),
    );
    for (const chain of this.graph.getChains("strong", 4)) {
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
          reason: `${this.getName()}: ${chain.map((node) => `${node.candidate.getCell().toString()}${node.type == "strong" ? "=" : "<>"}${node.candidate.getDigit() + 1}`, "").join("=>")}`,
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

import { Resolver } from "@/model/resolvers/AbstractResolver";
import type Sudoku from "@/model/Sudoku";
import { InferenceGraph } from "@/model/InferenceChainGraph";
import type { Step } from "@/types";

export class AIC extends Resolver {
  private maxLength: number;
  private loop: boolean;
  private graph: InferenceGraph;

  constructor(sudoku: Sudoku, maxLength = 16, loop = false) {
    super(sudoku);
    this.maxLength = maxLength;
    this.loop = loop;
    this.graph = new InferenceGraph(this.sudoku);
  }

  public resolve(): Step | undefined {
    this.graph.build(this.sudoku.getAllSetCandidates());
    for (const chain of this.graph.getChains("strong", 4, 16)) {
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
    return "AIC";
  }
}

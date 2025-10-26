import { Resolver } from "@/model/resolvers/AbstractResolver";
import { InferenceGraph } from "@/model/InferenceChainGraph";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits } from "@/util";

export class XChainResolver extends Resolver {
  private graph: InferenceGraph;

  constructor(sudoku: Sudoku) {
    super(sudoku);
    this.graph = new InferenceGraph(this.sudoku);
  }

  public resolve(): Step | undefined {
    for (const digit of digits()) {
      this.graph.build(this.sudoku.getAllSetCandidates().filter((c) => c.getDigit() == digit));
      for (const chain of this.graph.getChains("strong", 4)) {
        console.log(chain);
        const start = chain.at(0)!.candidate;
        const end = chain.at(-1)!.candidate;
        const candidates = this.sudoku
          .getGroupSeenByCell(start.getCell())
          .getIntersection(this.sudoku.getGroupSeenByCell(end.getCell()))
          .getCellsWithCandidate(digit)
          .map((cell) => cell.getCandidate(digit));

        if (candidates.length > 0) {
          return {
            type: "eliminate",
            reason: `${this.getName()}: ${chain.map((node) => `${node.candidate.getCell().toString()}${node.type == "strong" ? "=" : "<>"}${digit + 1}`, "").join("=>")}`,
            candidates,
            participants: chain.map((it) => it.candidate),
          };
        }
      }
    }

    return undefined;
  }

  public getName(): string {
    return "X-Chain";
  }
}

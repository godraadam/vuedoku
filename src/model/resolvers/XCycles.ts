import { Resolver } from "@/model/resolvers/AbstractResolver";
import { InferenceGraph } from "@/model/InferenceChainGraph";
import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";
import { digits, rollingWindows } from "@/util";
import type Candidate from "../Candidate";
import { Group } from "../Group";

export class XCycleResolver extends Resolver {
  private graph: InferenceGraph;

  constructor(sudoku: Sudoku) {
    super(sudoku);
    this.graph = new InferenceGraph(this.sudoku, true);
  }

  public resolve(): Step | undefined {
    for (const digit of digits()) {
      this.graph.build(this.sudoku.getAllSetCandidates().filter((c) => c.getDigit() == digit));
      for (const chain of this.graph.getChains("strong", 4, 16)) {
        const eliminationCandidates: Array<Candidate> = [];
        for (const [nodeA, nodeB] of rollingWindows(chain, 2)) {
          const cellsSeenByBoth = new Group(
            this.sudoku
              .getCellsSeenBy(nodeA.candidate.getCell())
              .filter((cell) => nodeB.candidate.getCell().canSee(cell))
              .filter(
                (cell) =>
                  !cell.equals(nodeA.candidate.getCell()) &&
                  !cell.equals(nodeB.candidate.getCell()),
              ),
          );
          const [candidateA, candidateB] = [nodeA.candidate.getDigit(), nodeB.candidate.getDigit()];
          eliminationCandidates.push(
            ...cellsSeenByBoth.getSetCandidatesOfDigit(candidateA),
            ...cellsSeenByBoth.getSetCandidatesOfDigit(candidateB),
          );
        }

        if (eliminationCandidates.length > 0) {
          return {
            type: "eliminate",
            reason: `${this.getName()}: ${chain.map((node) => `${node.candidate.getCell().toString()}${node.type == "strong" ? "=" : "<>"}${digit + 1}`, "").join("=>")}`,
            candidates: eliminationCandidates,
            participants: chain.map((it) => it.candidate),
          };
        }
      }
    }

    return undefined;
  }

  public getName(): string {
    return "X-Cycle";
  }
}

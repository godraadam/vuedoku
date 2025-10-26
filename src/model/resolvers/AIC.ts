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
    // TODO
    return undefined;
  }

  public getName(): string {
    return "Alternating Inference Chain";
  }
}

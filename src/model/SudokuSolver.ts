import Sudoku from "@/model/Sudoku";
import { Resolver } from "@/model/resolvers/AbstractResolver";
import { HiddenTupleResolver } from "@/model/resolvers/HiddenTuples";
import { NakedTupleResolver } from "@/model/resolvers/NakedTuples";
import { FishResolver } from "@/model/resolvers/Fish";
import { PointingCandidates } from "@/model/resolvers/PointingCandidates";
import { ClaimingCandidates } from "@/model/resolvers/ClaimingCandidates";
import { CPRResolver } from "@/model/resolvers/ChuteRemotePair";
import { Wing } from "@/model/resolvers/Wing";
import { XChainResolver } from "@/model/resolvers/XChain";
import { XYChainResolver } from "@/model/resolvers/XYChain";
import { AIC } from "@/model/resolvers/AIC";
import type { Step } from "@/types";

export class SudokuSolver {
  private sudoku: Sudoku;

  private resolvers: Array<Resolver>;

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
    // order matters
    this.resolvers = [
      new NakedTupleResolver(this.sudoku, 1),
      new HiddenTupleResolver(this.sudoku, 1),
      new NakedTupleResolver(this.sudoku, 2),
      new HiddenTupleResolver(this.sudoku, 2),
      new NakedTupleResolver(this.sudoku, 3),
      new HiddenTupleResolver(this.sudoku, 3),
      new PointingCandidates(this.sudoku),
      new ClaimingCandidates(this.sudoku),
      new NakedTupleResolver(this.sudoku, 4),
      new HiddenTupleResolver(this.sudoku, 4),
      new NakedTupleResolver(this.sudoku, 5),
      new HiddenTupleResolver(this.sudoku, 5),
      new FishResolver(this.sudoku, 2),
      new Wing(this.sudoku, 3),
      new Wing(this.sudoku, 4),
      new CPRResolver(this.sudoku),
      new XChainResolver(this.sudoku),
      new XYChainResolver(this.sudoku),
      new FishResolver(this.sudoku, 3),
      new FishResolver(this.sudoku, 4),
      new FishResolver(this.sudoku, 5),
      new Wing(this.sudoku, 5),
      new AIC(this.sudoku, 5),
    ];
  }

  public solve() {
    let step: Step | undefined;
    let isSolved = false;
    do {
      step = this.getNextStep();
      if (step) {
        this.sudoku.applyStep(step);
        isSolved = this.sudoku.isProperSolved();
      }
    } while (step && !isSolved);
  }

  public getNextStep() {
    for (const resolver of this.resolvers) {
      const res = resolver.resolve();
      if (res) {
        return res;
      }
    }
    return undefined;
  }
}

import Sudoku from "@/model/Sudoku";
import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import { HiddenTupleResolver } from "@/model/strategies/HiddenTuples";
import { NakedTupleResolver } from "@/model/strategies/NakedTuples";
import { FishResolver } from "@/model/strategies/Fish";
import { PointingCandidates } from "@/model/strategies/PointingCandidates";
import { ClaimingCandidates } from "@/model/strategies/ClaimingCandidates";
import { CPRResolver } from "@/model/strategies/ChuteRemotePair";
import { Wing } from "@/model/strategies/Wing";
import { XYChainResolver } from "@/model/strategies/XYChain";
import { AIC } from "@/model/strategies/AIC";
import { DoubleClaimResolver } from "@/model/strategies/DoubleClaim";
import { XChainResolver } from "@/model/strategies/XChain";
import type { Step } from "@/types";
import { XCycleResolver } from "@/model/strategies/XCycle";
import { XYCycleResolver } from "@/model/strategies/XYCycle";

export class SudokuSolver {
  private sudoku: Sudoku;

  private resolvers: Array<AbstractStrategy>;

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
    // order matters
    this.resolvers = [
      new NakedTupleResolver(this.sudoku, 1),
      new HiddenTupleResolver(this.sudoku, 1),
      new NakedTupleResolver(this.sudoku, 2),
      new HiddenTupleResolver(this.sudoku, 2),
      new PointingCandidates(this.sudoku),
      new ClaimingCandidates(this.sudoku),
      new NakedTupleResolver(this.sudoku, 3),
      new HiddenTupleResolver(this.sudoku, 3),
      new DoubleClaimResolver(this.sudoku),
      new NakedTupleResolver(this.sudoku, 4),
      new HiddenTupleResolver(this.sudoku, 4),
      new CPRResolver(this.sudoku),
      new FishResolver(this.sudoku, 2),
      new Wing(this.sudoku, 3),
      new FishResolver(this.sudoku, 3),
      new Wing(this.sudoku, 4),
      new FishResolver(this.sudoku, 4),
      new Wing(this.sudoku, 5),
      new FishResolver(this.sudoku, 5),

      // nice loops with single digit -> nice loops with single digit variance
      // -> single digit chains -> chains with one digit variance - of increasing lengths
      new XCycleResolver(this.sudoku, 4),
      new XYCycleResolver(this.sudoku, 4),
      new XChainResolver(this.sudoku, 3),
      new XYChainResolver(this.sudoku, 3),

      new XYCycleResolver(this.sudoku, 6),
      new XCycleResolver(this.sudoku, 6),
      new XChainResolver(this.sudoku, 5),
      new XYChainResolver(this.sudoku, 5),

      new XCycleResolver(this.sudoku, 8),
      new XYCycleResolver(this.sudoku, 8),
      new XChainResolver(this.sudoku, 7),
      new XYChainResolver(this.sudoku, 7),

      new XCycleResolver(this.sudoku, 10),
      new XYCycleResolver(this.sudoku, 10),
      new XChainResolver(this.sudoku, 9),
      new XYChainResolver(this.sudoku, 9),

      new XCycleResolver(this.sudoku, 12),
      new XYCycleResolver(this.sudoku, 12),
      new XChainResolver(this.sudoku, 11),
      new XYChainResolver(this.sudoku, 11),

      new AIC(this.sudoku, 5),
      new AIC(this.sudoku, 7),
      new AIC(this.sudoku, 9),
      new AIC(this.sudoku, 11),
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

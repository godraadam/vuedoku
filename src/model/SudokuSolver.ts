import Sudoku from "@/model/Sudoku";
import { AbstractStrategy } from "@/model/strategies/AbstractStrategy";
import { HiddenTupleResolver } from "@/model/strategies/HiddenTuples";
import { NakedTupleResolver } from "@/model/strategies/NakedTuples";
import { Fish } from "@/model/strategies/Fish";
import { Wing } from "@/model/strategies/Wing";
import { FinnedFish } from "@/model/strategies/FinnedFish";
import { PointingCandidates } from "@/model/strategies/PointingCandidates";
import { ClaimingCandidates } from "@/model/strategies/ClaimingCandidates";
import { CPRResolver } from "@/model/strategies/ChuteRemotePair";
import { XYChainResolver } from "@/model/strategies/XYChain";
import { AIC } from "@/model/strategies/AIC";
import { XChainResolver } from "@/model/strategies/XChain";
import { XCycleResolver } from "@/model/strategies/XCycle";
import { XYCycleResolver } from "@/model/strategies/XYCycle";
import { DiscontinousXCycle2 } from "@/model/strategies/DiscontinuousXCycle2";
import { DiscontinousXCycle1 } from "@/model/strategies/DiscontinuousXCycle1";
import { DiscontinousXYCycle1 } from "@/model/strategies/DiscontinuousXYCycle1";
import { DiscontinousXYCycle2 } from "@/model/strategies/DiscontinuousXYCyle2";
import { BUG } from "@/model/strategies/BUG";
import type { Step } from "@/types";

export class SudokuSolver {
  private sudoku: Sudoku;

  private strategies: Array<AbstractStrategy>;

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
    // order matters
    this.strategies = [
      new NakedTupleResolver(this.sudoku, 1),
      new HiddenTupleResolver(this.sudoku, 1),
      new NakedTupleResolver(this.sudoku, 2),
      new HiddenTupleResolver(this.sudoku, 2),
      new PointingCandidates(this.sudoku),
      new ClaimingCandidates(this.sudoku),
      new NakedTupleResolver(this.sudoku, 3),
      new HiddenTupleResolver(this.sudoku, 3),
      new NakedTupleResolver(this.sudoku, 4),
      new HiddenTupleResolver(this.sudoku, 4),
      new BUG(this.sudoku),
      new CPRResolver(this.sudoku),
      new Fish(this.sudoku, 2),
      new Wing(this.sudoku, 3),
      new FinnedFish(this.sudoku, 2),
      new Fish(this.sudoku, 3),
      new Wing(this.sudoku, 4),
      new FinnedFish(this.sudoku, 3),
      new Fish(this.sudoku, 4),
      new Wing(this.sudoku, 5),
      new FinnedFish(this.sudoku, 4),
      new Fish(this.sudoku, 5),

      // nice loops with single digit -> nice loops with single digit variance
      // -> single digit chains -> chains with one digit variance - of increasing lengths
      new DiscontinousXCycle2(this.sudoku, 5),
      new XCycleResolver(this.sudoku, 4),
      new DiscontinousXCycle1(this.sudoku, 5),
      new XChainResolver(this.sudoku, 3),
      new DiscontinousXYCycle2(this.sudoku, 5),
      new XYCycleResolver(this.sudoku, 4),
      new DiscontinousXYCycle1(this.sudoku, 5),
      new XYChainResolver(this.sudoku, 3),
      new AIC(this.sudoku, 3),

      new DiscontinousXCycle2(this.sudoku, 7),
      new XCycleResolver(this.sudoku, 6),
      new DiscontinousXCycle1(this.sudoku, 7),
      new XChainResolver(this.sudoku, 5),
      new DiscontinousXYCycle1(this.sudoku, 5),
      new XYCycleResolver(this.sudoku, 6),
      new DiscontinousXYCycle2(this.sudoku, 5),
      new XYChainResolver(this.sudoku, 5),
      new AIC(this.sudoku, 5),

      new DiscontinousXCycle2(this.sudoku, 9),
      new XCycleResolver(this.sudoku, 8),
      new DiscontinousXCycle1(this.sudoku, 9),
      new XChainResolver(this.sudoku, 7),
      new DiscontinousXYCycle2(this.sudoku, 7),
      new XYCycleResolver(this.sudoku, 8),
      new DiscontinousXYCycle1(this.sudoku, 7),
      new XYChainResolver(this.sudoku, 7),
      new AIC(this.sudoku, 7),

      new DiscontinousXCycle2(this.sudoku, 11),
      new XCycleResolver(this.sudoku, 10),
      new DiscontinousXCycle1(this.sudoku, 11),
      new XChainResolver(this.sudoku, 9),
      new DiscontinousXCycle2(this.sudoku, 11),
      new XYCycleResolver(this.sudoku, 10),
      new DiscontinousXCycle1(this.sudoku, 11),
      new XYChainResolver(this.sudoku, 9),
      new AIC(this.sudoku, 9),

      new DiscontinousXCycle2(this.sudoku, 13),
      new XCycleResolver(this.sudoku, 12),
      new DiscontinousXCycle1(this.sudoku, 13),
      new XChainResolver(this.sudoku, 11),
      new DiscontinousXYCycle2(this.sudoku, 13),
      new XYCycleResolver(this.sudoku, 12),
      new DiscontinousXYCycle1(this.sudoku, 13),
      new XYChainResolver(this.sudoku, 11),
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
    for (const strategy of this.strategies) {
      const res = strategy.resolve();
      if (res) {
        return res;
      }
    }
    return undefined;
  }
}

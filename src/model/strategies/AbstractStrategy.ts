import type Sudoku from "@/model/Sudoku";
import type { Step } from "@/types";

export abstract class AbstractStrategy {
  protected sudoku: Sudoku;

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
  }

  public abstract resolve(): Step | undefined;

  public abstract getName(): string;

  public abstract getDifficultyScore(): number;
  public abstract getLink(): string | undefined;
}

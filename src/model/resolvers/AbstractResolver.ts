import type { Step } from "@/types";
import type Sudoku from "@/model/Sudoku";

export abstract class Resolver {
  protected sudoku: Sudoku;

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
  }

  public abstract resolve(): Step | undefined;

  public abstract getName(): string;
}

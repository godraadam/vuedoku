import Cell from "@/model/Cell";
import type { UnitType } from "@/types";
import { digits } from "@/util";
import { Group } from "@/model/Group";

export default class SudokuUnit extends Group {
  private type: UnitType;
  private idx: number;

  constructor(type: UnitType, idx: number, cells: Array<Cell>) {
    super(cells);
    this.type = type;
    this.idx = idx;
  }

  public getIdx() {
    return this.idx;
  }

  public getType() {
    return this.type;
  }

  public getDisplay() {
    const displayMap: Record<UnitType, string> = {
      row: "row",
      col: "column",
      box: "box",
      xchute: "horizontal chute",
      ychute: "vertical chute",
    };
    return displayMap[this.type];
  }

  // used for validating a sudoku and reporting conflicting cells
  public getCellsWithValue(value: number) {
    return this._cells.filter((cell) => cell.getValue() == value);
  }

  public validate() {
    const conflicts: Array<Cell> = [];
    // check each row, column and square
    for (const digit of digits()) {
      const cells = this.getCellsWithValue(digit);
      if (cells.length > 1) {
        conflicts.push(...cells);
      }
    }
    if (conflicts.length < 1) {
      return { valid: true } as const;
    }
    return { valid: false, conflicts } as const;
  }
}

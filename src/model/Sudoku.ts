import Cell from "@/model/Cell";
import SudokuUnit from "@/model/Unit";
import Candidate from "@/model/Candidate";
import { Group } from "@/model/Group";
import { digits } from "@/util";
import type { Step, UnitType } from "@/types";
import { InferenceGraph } from "@/model/InferenceGraph";

export default class Sudoku {
  private state: Array<Cell>;
  private _rows: Array<SudokuUnit> = [];
  private _cols: Array<SudokuUnit> = [];
  private _boxes: Array<SudokuUnit> = [];
  private _xchutes: Array<SudokuUnit> = [];
  private _ychutes: Array<SudokuUnit> = [];
  private userSetCandidatesCache = new Map<Candidate, boolean>();
  private inferenceGraph: InferenceGraph;
  private placedValueCounts = Array(9).fill(0);

  private unitsMap: Record<UnitType, Array<SudokuUnit>> = {
    row: this._rows,
    col: this._cols,
    box: this._boxes,
    xchute: this._xchutes,
    ychute: this._ychutes,
  };

  /**
   *
   * @param initalValues 81 element array, containing `value - 1`, or `-1` for unsolved cells
   * read left-to-right, top-to-bottom, i.e. top-left cell is index 0, bottom-right cell is index 80
   */
  constructor(initialValues?: Array<number>) {
    this.state = Array.from({ length: 9 * 9 }, (_, i) => new Cell(i));
    this.inferenceGraph = new InferenceGraph(this);
    if (initialValues) {
      this.initalize(initialValues);
    }
    this.inferenceGraph.buildGraph();
  }

  public initalize(initialValues: Array<number>) {
    initialValues.forEach((val, idx) => {
      if (val != -1) {
        this.placeValueInCell(idx, val, true, false);
      }
    });
  }

  public getCells() {
    return this.state;
  }

  public getCellByIdx(idx: number) {
    return this.state[idx];
  }

  public getCellsSeenBy(cell: Cell) {
    const unitTypes = ["row", "col", "box"] as const;
    const seenCells = new Set<Cell>();
    for (const unitType of unitTypes) {
      const unit = this.getUnit(unitType, cell.getUnitIdx(unitType));
      unit.getCells().forEach((_cell) => !_cell.equals(cell) && seenCells.add(_cell));
    }
    return Array.from(seenCells);
  }

  public getGroupSeenByCell(cell: Cell) {
    return new Group(this.getCellsSeenBy(cell));
  }

  public getRow(rowIdx: number) {
    return this.getUnit("row", rowIdx);
  }

  public getCol(colIdx: number) {
    return this.getUnit("col", colIdx);
  }

  public getBox(boxIdx: number) {
    return this.getUnit("box", boxIdx);
  }

  public getHorizontalChute(chuteIdx: number) {
    return this.getUnit("xchute", chuteIdx);
  }

  public getVerticalChute(chuteIdx: number) {
    return this.getUnit("ychute", chuteIdx);
  }

  public getUnit(unit: UnitType, unitIdx: number): SudokuUnit {
    const container = this.unitsMap[unit];
    if (container[unitIdx]) {
      return container[unitIdx];
    }
    const cells = this.state.filter((cell) => cell.getUnitIdx(unit) == unitIdx);
    container[unitIdx] = new SudokuUnit(unit, unitIdx, cells);
    return container[unitIdx];
  }

  public getUnits(unit: UnitType): Array<SudokuUnit> {
    return this.unitsMap[unit];
  }

  public *rows() {
    for (let i = 0; i < 9; i++) {
      yield this.getRow(i);
    }
  }

  public *cols() {
    for (let i = 0; i < 9; i++) {
      yield this.getCol(i);
    }
  }

  public *boxes() {
    for (let i = 0; i < 9; i++) {
      yield this.getBox(i);
    }
  }

  public *horizontalChutes() {
    for (let i = 0; i < 3; i++) {
      yield this.getHorizontalChute(i);
    }
  }

  public *verticalChutes() {
    for (let i = 0; i < 3; i++) {
      yield this.getVerticalChute(i);
    }
  }

  public *units(unitType: UnitType) {
    for (let i = 0; i < 9; i++) {
      yield this.getUnit(unitType, i);
    }
  }

  // used for testing
  public applyStep(step: Step) {
    if (step.type == "place") {
      this.placeValueInCell(step.place.getCell().getCellIdx(), step.place.getDigit(), false, true);
    }
    if (step.type == "eliminate") {
      step.candidates.forEach((cand) => this.setCandidate(cand, false));
      this.inferenceGraph.buildGraph();
    }
  }

  public placeValueInCell(
    cellIdx: number,
    digit: number,
    isGiven = false,
    updateInferenceGraph = true,
  ) {
    const cell = this.getCellByIdx(cellIdx);
    if (cell.isGiven()) {
      return;
    }
    // place value in cell
    cell.setValue(digit, isGiven);
    cell.getSetCandidates().forEach((cand) => this.setCandidate(cand, false));

    const seenSetCandidates = this.getCellsSeenBy(cell)
      .map((cell) => cell.getCandidate(digit))
      .filter((candidate) => candidate.isSet());

    seenSetCandidates.forEach((candidate) => this.setCandidate(candidate, false));
    if (updateInferenceGraph) {
      this.inferenceGraph.buildGraph();
    }

    this.placedValueCounts[digit]++;
  }

  public removeValueFromCell(cellIdx: number) {
    const cell = this.getCellByIdx(cellIdx);
    if (!cell.isFilled() || this.state[cellIdx].isGiven()) {
      return;
    }
    const digit = cell.getValue();
    cell.setValue(-1);

    // place candidates back in seen cells, except ones removed by the player
    const seenCells = this.getCellsSeenBy(cell);
    const candidatesInCell = cell.getCandidates();
    const seenCandidates = seenCells
      .filter((cell) => !cell.isFilled())
      .map((cell) => cell.getCandidate(digit));

    const candidatesToReset: Array<Candidate> = [];
    candidatesToReset.push(
      ...seenCandidates.filter(
        (candidate) =>
          this.userSetCandidatesCache.get(candidate) != false &&
          this.getCellsSeenBy(candidate.getCell()).every((_cell) => _cell.getValue() != digit),
      ),
    );
    candidatesToReset.push(
      ...candidatesInCell.filter((candidate) =>
        seenCells.every((cell) => cell.getValue() != candidate.getDigit()),
      ),
    );
    candidatesToReset.forEach((candidate) => this.setCandidate(candidate, true));
    this.placedValueCounts[digit]--;
    this.inferenceGraph.buildGraph();
  }

  public setCandidate(
    candidate: Candidate,
    isSet: boolean,
    isEliminated = false,
    rebuildGraph = false,
  ) {
    if (isEliminated) {
      this.userSetCandidatesCache.set(candidate, isSet);
    }
    candidate.setState(isSet);
    if (rebuildGraph) {
      this.inferenceGraph.buildGraph();
    }
  }

  public findCell(
    pred: (p: { cell: Cell; row: Array<Cell>; col: Array<Cell>; box: Array<Cell> }) => boolean,
  ) {
    for (let idx = 0; idx < 81; idx++) {
      const cell = this.getCellByIdx(idx);
      const row = this.getRow(cell.getRowIdx()).getCells();
      const col = this.getRow(cell.getColIdx()).getCells();
      const box = this.getRow(cell.getBoxIdx()).getCells();
      if (pred({ cell, row, col, box })) {
        return cell;
      }
    }
    return undefined;
  }

  public isFilled() {
    return this.state.every((cell) => cell.isFilled());
  }

  public getUnsolvedCellCount() {
    return this.state.reduce((count, cell) => (cell.isFilled() ? count : count + 1), 0);
  }

  public getSolvedCellCount() {
    return 81 - this.getUnsolvedCellCount();
  }

  public getCommonUnits(cellA: Cell, cellB: Cell) {
    const units: Array<SudokuUnit> = [];
    const unitTypes = ["col", "row", "box"] as const;
    for (const unitType of unitTypes) {
      if (cellA.getUnitIdx(unitType) == cellB.getUnitIdx(unitType)) {
        units.push(this.getUnit(unitType, cellA.getUnitIdx(unitType)));
      }
    }
    return units;
  }

  public encodeState() {
    let output = "";
    for (const cell of this.state) {
      if (!cell.isFilled()) {
        output += "0";
      } else {
        output += (cell.getValue() + 1).toString();
      }
    }
    return output;
  }

  public validateState() {
    const conflicts: Array<Cell> = [];
    // check each row, column and square
    const unitTypes = ["row", "col", "box"] as const;
    for (const unitType of unitTypes) {
      for (const unit of this.units(unitType)) {
        for (const digit of digits()) {
          const cells = unit.getCellsWithValue(digit);
          if (cells.length > 1) {
            conflicts.push(...cells);
          }
        }
      }
    }
    if (conflicts.length < 1) {
      return { valid: true } as const;
    }
    return { valid: false, conflicts } as const;
  }

  public isProperSolved() {
    return this.isFilled() && this.validateState().valid;
  }

  public getNeighborOfCell(cell: Cell, direction: "up" | "down" | "right" | "left") {
    const currentIdx = cell.getCellIdx();
    const offset = this.getOffset(cell.getCellIdx(), direction);

    return this.getCellByIdx(currentIdx + offset);
  }

  private getOffset(currentIdx: number, direction: "up" | "down" | "right" | "left") {
    let offset = 0;
    if (direction == "up") {
      offset = currentIdx - 9 >= 0 ? -9 : 0;
    } else if (direction == "down") {
      offset = currentIdx + 9 < 81 ? 9 : 0;
    } else if (direction == "left") {
      offset = currentIdx % 9 > 0 ? -1 : 0;
    } else if (direction == "right") {
      offset = currentIdx % 9 < 8 ? 1 : 0;
    }

    return offset;
  }

  public getFirstUnsolvedNeighborOfCell(cell: Cell, direction: "up" | "down" | "right" | "left") {
    let currentCell = cell;

    let nextCell = this.getNeighborOfCell(currentCell, direction);
    if (nextCell.equals(currentCell)) {
      return cell;
    }
    do {
      currentCell = nextCell;
      nextCell = this.getNeighborOfCell(currentCell, direction);
    } while (!currentCell.equals(nextCell) && !(currentCell.isFilled() && !nextCell.isFilled()));
    return nextCell;
  }

  public getLastNeighborOfCell(cell: Cell, direction: "up" | "down" | "right" | "left") {
    const currentIdx = cell.getCellIdx();
    let nextIdx = 0;
    if (direction == "up") {
      nextIdx = cell.getColIdx();
    } else if (direction == "down") {
      nextIdx = 72 + cell.getColIdx();
    } else if (direction == "left") {
      nextIdx = currentIdx - cell.getColIdx();
    } else if (direction == "right") {
      nextIdx = currentIdx + (8 - cell.getColIdx());
    }

    return this.state[nextIdx];
  }

  public getAllSetCandidatesOfDigit(digit: number) {
    return this.state.reduce<Candidate[]>(
      (acc, cell) => (cell.hasCandidate(digit) ? [...acc, cell.getCandidate(digit)] : acc),
      [],
    );
  }

  public getAllCandidates() {
    return this.state.reduce<Candidate[]>((acc, cell) => [...acc, ...cell.getCandidates()], []);
  }

  public getAllSetCandidates() {
    return this.state.reduce<Candidate[]>((acc, cell) => [...acc, ...cell.getSetCandidates()], []);
  }

  public getUserSetCandidates() {
    return this.userSetCandidatesCache;
  }

  public getBoxesOfFloor(floorIdx: number) {
    return this._boxes.filter((box) => Math.floor(box.getIdx() / 3) == floorIdx);
  }

  public getBoxesOfTower(floorIdx: number) {
    return this._boxes.filter((box) => box.getIdx() % 3 == floorIdx);
  }

  public getBoxesOfChute(chuteIdx: number, unitType: "xchute" | "ychute") {
    if (unitType == "xchute") {
      return this.getBoxesOfFloor(chuteIdx);
    }
    return this.getBoxesOfTower(chuteIdx);
  }

  public getInferenceGraph() {
    return this.inferenceGraph;
  }

  public *digits() {
    for (let i = 0; i < this.placedValueCounts.length; i++) {
      if (this.placedValueCounts[i] == 9) {
        continue;
      }
      yield i;
    }
  }
}

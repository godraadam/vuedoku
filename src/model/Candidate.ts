import Cell from "@/model/Cell";

export default class Candidate {
  private idx: number;
  private cell: Cell;
  private digit: number;
  private _isSet: boolean;

  constructor(cell: Cell, digit: number) {
    this.cell = cell;
    this.digit = digit;

    // any candidate is set by default
    this._isSet = true;
    this.idx = cell.getCellIdx() * 9 + digit;
  }

  public isSet() {
    return this._isSet;
  }

  public setState(state: boolean) {
    this._isSet = state;
  }

  public toggleState() {
    this._isSet = !this._isSet;
  }

  public getCell() {
    return this.cell;
  }

  public getDigit() {
    return this.digit;
  }

  public getCandidateIdx() {
    return this.idx;
  }

  public equals(cand: Candidate) {
    return this.idx == cand.getCandidateIdx();
  }
}

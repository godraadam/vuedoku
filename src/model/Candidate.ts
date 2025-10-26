import type Cell from "@/model/Cell";

export default class Candidate {
  private idx: number;
  private cell: Cell;
  private digit: number;
  private state: boolean;

  constructor(cell: Cell, digit: number, state: boolean = false) {
    this.cell = cell;
    this.digit = digit;
    this.state = state;
    this.idx = cell.getCellIdx() * 9 + digit;
  }

  public isSet() {
    return this.state;
  }

  public setState(state: boolean) {
    this.state = state;
  }

  public toggleState() {
    this.state = !this.state;
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

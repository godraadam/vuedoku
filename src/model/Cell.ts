import type { UnitType } from "@/types";
import Candidate from "@/model/Candidate";

export default class Cell {
  private idx: number;
  private candidates: Array<Candidate>;
  private solvedValue = -1;
  private rowIdx: number;
  private colIdx: number;
  private boxIdx: number;
  private horizontalChuteIdx: number;
  private verticalChuteIdx: number;
  private _isGiven: boolean;

  constructor(idx: number, candidateDefault = true) {
    this.idx = idx;
    this.colIdx = this.idx % 9;
    this.rowIdx = Math.floor(this.idx / 9);
    this.boxIdx = Math.floor(this.colIdx / 3) + (this.rowIdx - (this.rowIdx % 3));
    this.horizontalChuteIdx = Math.floor(this.rowIdx / 3);
    this.verticalChuteIdx = Math.floor(this.colIdx / 3);
    this.candidates = Array.from({ length: 9 }, (_, i) => new Candidate(this, i, candidateDefault));
    this._isGiven = false;
  }

  public getCellIdx() {
    return this.idx;
  }

  public getColIdx() {
    return this.colIdx;
  }

  public getRowIdx() {
    return this.rowIdx;
  }

  public isGiven() {
    return this._isGiven;
  }

  public getBoxIdx() {
    return this.boxIdx;
  }

  public getHorizontalChuteIdx() {
    return this.horizontalChuteIdx;
  }
  public getVerticalChuteIdx() {
    return this.verticalChuteIdx;
  }

  public getUnitIdx(unitType: UnitType): number {
    const handlerMap: Record<UnitType, () => number> = {
      row: this.getRowIdx,
      col: this.getColIdx,
      box: this.getBoxIdx,
      xchute: this.getHorizontalChuteIdx,
      ychute: this.getVerticalChuteIdx,
    };
    return handlerMap[unitType].call(this);
  }

  public removeCandidate(value: number) {
    this.getCandidate(value).setState(false);
  }

  public setCandidate(value: number, state: boolean) {
    this.getCandidate(value).setState(state);
  }

  public toggleCandidate(value: number) {
    this.getCandidate(value).toggleState();
  }

  public hasCandidate(value: number) {
    return this.getCandidate(value).getState();
  }

  public getCandidateCount() {
    return this.getCandidates().reduce((count, c) => (c.getState() ? count + 1 : count), 0);
  }

  public isFilled() {
    return this.solvedValue != -1;
  }

  public getValue() {
    return this.solvedValue;
  }

  public setValue(value: number, isGiven = false) {
    this.solvedValue = value;
    this._isGiven = isGiven;
    this.getCandidates().forEach((c) => c.setState(false));
  }

  public getCandidateList() {
    return this.getCandidates()
      .filter((c) => c.getState())
      .map((cand) => cand.getDigit());
  }

  public getCandidate(digit: number) {
    return this.candidates[digit];
  }

  public getCandidates() {
    return this.candidates;
  }

  public getSetCandidates() {
    return this.candidates.filter((c) => c.getState() == true);
  }

  public hasSameCandidatesAs(cell: Cell) {
    return this.getCandidates().every(
      (cand) => cand.getState() == cell.hasCandidate(cand.getDigit()),
    );
  }

  public equals(cell: Cell) {
    return cell.getCellIdx() == this.getCellIdx();
  }

  public canSee(cell: Cell): boolean {
    return (["row", "col", "box"] as const).some(
      (unitType: UnitType) => cell.getUnitIdx(unitType) == this.getUnitIdx(unitType),
    );
  }

  public resetCandidates() {
    this.getCandidates().forEach((cand) => cand.setState(true));
  }

  public toString() {
    return `r${this.rowIdx + 1}c${this.colIdx + 1}`;
  }
}

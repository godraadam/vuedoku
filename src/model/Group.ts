import type Cell from "@/model/Cell";
import { getKCombinations } from "@/util";

export class Group {
  protected _cells: Array<Cell>;

  constructor(cells: Array<Cell>) {
    const cellSet = new Set(cells);
    this._cells = Array.from(cellSet);
  }

  public getCells() {
    return this._cells;
  }

  public getSize() {
    return this._cells.length;
  }

  public getCandidates() {
    return this._cells.map((cell) => cell.getCandidates()).flat();
  }

  public getSetCandidatesOfDigit(digit: number) {
    return this._cells
      .map((cell) => cell.getSetCandidates().filter((it) => it.getDigit() == digit))
      .flat();
  }

  public getSetCandidates() {
    return this._cells.map((cell) => cell.getSetCandidates()).flat();
  }

  public getCandidateSet() {
    const candidateDigits = new Set<number>();
    this.getSetCandidates().forEach((cand) => candidateDigits.add(cand.getDigit()));
    return Array.from(candidateDigits);
  }

  public getCandidateCount() {
    return this.getCandidateSet().length;
  }

  public getCountsOfCandidates(): Array<{ count: number; digit: number }> {
    const counts = Array(9).fill(0);
    for (const cell of this.cells()) {
      const candidates = cell.getCandidateList();
      for (const candidate of candidates) {
        counts[candidate] += 1;
      }
    }
    return counts.map((count, digit) => ({ count, digit }));
  }

  public getCountOfCandidate(digit: number) {
    return this._cells.reduce((count, cell) => (cell.hasCandidate(digit) ? count + 1 : count), 0);
  }

  public getCellsWithCandidate(digit: number) {
    return this._cells.filter((cell) => cell.hasCandidate(digit));
  }

  public isLockedSet() {
    return this.getSize() == this.getCandidateCount();
  }

  public isAlmostLockedSet() {
    return this.getSize() != this.getCandidateCount() - 1;
  }

  public includesCell(cell: Cell) {
    return this._cells.some((_cell) => _cell.equals(cell));
  }

  public getIntersection(group: Group) {
    return new Group(this._cells.filter((cell) => group.includesCell(cell)));
  }

  public getNonRestrictedCommons() {
    const candidates = this.getCandidateSet();
    const nrcs = [];
    for (const digit of candidates) {
      // find cells with candidate
      const cells = this._cells.filter((cell) => cell.hasCandidate(digit));
      if (getKCombinations(cells, 2).some(([cellA, cellB]) => !cellA.canSee(cellB))) {
        nrcs.push(digit);
      }
    }
    return nrcs;
  }

  public *cells() {
    for (let i = 0; i < 9; i++) {
      yield this._cells[i]!;
    }
  }
}

import type Cell from "@/model/Cell";
import { kCombinations } from "@/util";

export class Group {
  protected _cells: Array<Cell>;

  constructor(cells: Array<Cell>) {
    this._cells = cells;
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

  public isLockedSet(
    options: { checkPairwiseVisibility: boolean } = { checkPairwiseVisibility: true },
  ) {
    if (this.getSize() != this.getCandidateCount()) {
      return false;
    }
    // if group is aleady known to be in one unit, we can skip this and save some time
    if (options.checkPairwiseVisibility) {
      for (const [cellA, cellB] of kCombinations(this._cells, 2)) {
        if (!cellA.canSee(cellB)) {
          return false;
        }
      }
    }
    return true;
  }

  public isAlmostLockedSet() {
    if (this.getSize() != this.getCandidateCount() - 1) {
      return false;
    }
    for (const [cellA, cellB] of kCombinations(this._cells, 2)) {
      if (!cellA.canSee(cellB)) {
        return false;
      }
    }
    return true;
  }

  public includesCell(cell: Cell) {
    return this._cells.some((_cell) => _cell.equals(cell));
  }

  public getIntersection(group: Group) {
    return new Group(this._cells.filter((cell) => group.includesCell(cell)));
  }

  public getRestrictedCommons(group: Group) {
    if (!this.isAlmostLockedSet() || group.isAlmostLockedSet()) {
      return [];
    }
    // need to develop understanding :))
    return [];
  }

  public *cells() {
    for (let i = 0; i < 9; i++) {
      yield this._cells[i]!;
    }
  }

  public removeCandidate(candidate: number) {
    this._cells.forEach((cell) => cell.removeCandidate(candidate));
  }

  public removeCandidates(candidates: Array<number>) {
    this._cells.forEach((cell) => candidates.forEach((cand) => cell.removeCandidate(cand)));
  }
}

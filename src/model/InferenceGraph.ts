import type Sudoku from "@/model/Sudoku";
import Candidate from "@/model/Candidate";
import { MultiMap } from "@/model/MultiMap";

export type LinkType = "weak" | "strong" | "any";
export type LocationType = "cell" | "unit";
export type NodeFilterFn = (node: Candidate) => boolean;

export class InferenceGraph {
  private sudoku: Sudoku;

  private _nodes: Array<Candidate> = [];
  // O(1) access, O(1) adding, O(1) removal
  private weakGraph = new MultiMap<Candidate, Candidate>();
  private strongGraph = new MultiMap<Candidate, Candidate>();

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
  }

  public buildGraph() {
    this.weakGraph = new MultiMap<Candidate, Candidate>();
    this.strongGraph = new MultiMap<Candidate, Candidate>();

    const setCandidates = this.sudoku.getAllSetCandidates();

    for (const candidate of setCandidates) {
      this._nodes.push(candidate);
      this.addLinksForNode(candidate);
    }
  }

  public getWeakLinksOfNode(node: Candidate, filter?: NodeFilterFn) {
    const nodes = this.weakGraph.get(node);
    if (!filter) {
      return nodes;
    }
    return nodes.filter(filter);
  }

  public getStrongLinksOfNode(node: Candidate, filter?: NodeFilterFn) {
    const nodes = this.strongGraph.get(node);
    if (!filter) {
      return nodes;
    }
    return nodes.filter(filter);
  }

  public getStrongLinks() {
    return Array.from(this.strongGraph.entries());
  }

  public getWeakLinks() {
    return Array.from(this.weakGraph.entries());
  }

  public *weakLinksOfNode(node: Candidate, filter?: NodeFilterFn) {
    for (const neighbor of this.weakGraph.get(node)) {
      if (!filter) {
        yield neighbor;
      } else if (!filter(neighbor)) {
        continue;
      }
      yield neighbor;
    }
  }

  public *strongLinksOfNode(node: Candidate, filter?: NodeFilterFn) {
    for (const neighbor of this.strongGraph.get(node)) {
      if (!filter) {
        yield neighbor;
      } else if (!filter(neighbor)) {
        continue;
      }
      yield neighbor;
    }
  }

  public addLinksForNode(candidate: Candidate | undefined) {
    if (!candidate) {
      return;
    }
    const candidatesInCell = candidate
      .getCell()
      .getSetCandidates()
      .filter((_candidate) => !candidate.equals(_candidate));

    const inferenceType = candidatesInCell.length > 1 ? "weak" : "strong";
    for (const _candidate of candidatesInCell) {
      if (_candidate.equals(candidate)) {
        continue;
      }
      this.addLink(candidate, _candidate, inferenceType);
    }
    // build links inside units
    const candidatesSeen = this.sudoku
      .getCellsSeenBy(candidate.getCell())
      .map((cell) => cell.getSetCandidates())
      .flat()
      .filter((_candidate) => _candidate.getDigit() == candidate.getDigit());
    for (const _candidate of candidatesSeen) {
      const commonUnits = this.sudoku.getCommonUnits(candidate.getCell(), _candidate.getCell());
      const inferenceType = commonUnits.some(
        (unit) => unit.getCountOfCandidate(candidate.getDigit()) == 2,
      )
        ? "strong"
        : "weak";
      this.addLink(candidate, _candidate, inferenceType);
    }
  }

  public addLink(from: Candidate, to: Candidate, type: LinkType) {
    if (type == "weak") {
      this.weakGraph.add(from, to);
    } else if (type == "strong") {
      this.strongGraph.add(from, to);
    }
  }

  public *nodes() {
    for (const node of this._nodes.values()) {
      yield node;
    }
  }
}

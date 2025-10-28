import type Candidate from "@/model/Candidate";
import type Sudoku from "@/model/Sudoku";
import { kCombinations } from "@/util";

export type LinkType = "weak" | "strong";
export type GraphElement = { candidate: Candidate; type: LinkType } | undefined;

export class InferenceGraph {
  private sudoku: Sudoku;
  private nodes: Array<Candidate>;
  private loop: boolean;
  private inferenceGraph: Array<Array<GraphElement>> = [];

  constructor(sudoku: Sudoku, loop?: boolean) {
    this.sudoku = sudoku;
    this.inferenceGraph = Array.from({ length: 81 * 9 }, () => Array(81 * 9).fill(undefined));
    this.nodes = [];
    this.loop = loop ?? false;
  }

  public build(nodes?: Array<Candidate>) {
    this.nodes = nodes ?? this.sudoku.getAllSetCandidates();
    this.inferenceGraph = Array.from({ length: 81 * 9 }, () => Array(81 * 9).fill(undefined));
    for (const [candA, candB] of kCombinations(this.nodes, 2)) {
      const cellA = candA.getCell();
      const cellB = candB.getCell();
      const digitA = candA.getDigit();
      const digitB = candB.getDigit();
      if (cellA.equals(cellB)) {
        if (cellA.getCandidateCount() == 2) {
          this.setLink(candA, candB, "strong");
        } else {
          this.setLink(candA, candB, "weak");
        }
      } else if (cellA.canSee(cellB)) {
        if (digitA == digitB) {
          if (
            this.sudoku
              .getCommonUnits(cellA, cellB)
              .some((unit) => unit.getCountOfCandidate(digitA) == 2)
          ) {
            this.setLink(candA, candB, "strong");
          } else {
            this.setLink(candA, candB, "weak");
          }
        }
      }
    }
  }

  private setLink(candA: Candidate, candB: Candidate, type: LinkType) {
    this.inferenceGraph[candA.getCandidateIdx()][candB.getCandidateIdx()] = {
      candidate: candB,
      type,
    };
    this.inferenceGraph[candB.getCandidateIdx()][candA.getCandidateIdx()] = {
      candidate: candA,
      type,
    };
  }

  public getLinks(cand: Candidate, type: LinkType) {
    return this.inferenceGraph[cand.getCandidateIdx()]
      .filter((it) => {
        if (it && !it.candidate.isSet()) {
          console.log(it.candidate);
        }
        return (
          it != undefined &&
          !it.candidate.equals(cand) &&
          it.candidate.isSet() &&
          (type == "strong" ? it.type == "strong" : true)
        );
      })
      .map((it) => it!.candidate);
  }

  public getLinkType(candA: Candidate, candB: Candidate) {
    return this.inferenceGraph[candA.getCandidateIdx()][candB.getCandidateIdx()]?.type;
  }

  public getNodes() {
    return this.nodes;
  }

  public *getChains(startType: LinkType, minLength = 4, maxLength = 16) {
    for (const start of this.nodes) {
      yield* this.traverseBfs(start, startType, minLength, maxLength);
    }
  }

  private *traverseDfs(
    current: Candidate,
    linkType: LinkType,
    path: Array<{ candidate: Candidate; type: LinkType }>,
    visited: Set<number>,
    minLength: number,
    maxLength: number,
  ): Generator<Array<{ candidate: Candidate; type: LinkType }>> {
    const currentIdx = current.getCandidateIdx();
    if (visited.has(currentIdx)) return;
    visited.add(currentIdx);

    const newPath = [...path, { candidate: current, type: linkType }];
    if (
      newPath.length >= minLength &&
      newPath.length % 2 == 0 &&
      newPath.at(0)!.candidate.getDigit() == newPath.at(-1)!.candidate.getDigit()
    )
      yield newPath;

    if (newPath.length >= maxLength) return;

    const nextLinks = this.getLinks(current, linkType);
    const nextType: LinkType = linkType == "strong" ? "weak" : "strong";

    for (const next of nextLinks) {
      yield* this.traverseDfs(next, nextType, newPath, new Set(visited), minLength, maxLength);
    }
  }

  private *traverseBfs(start: Candidate, linkType: LinkType, minLength: number, maxLength: number) {
    const queue: Array<{
      path: Array<{ candidate: Candidate; type: LinkType }>;
      nextType: LinkType;
    }> = [
      {
        path: [{ candidate: start, type: "weak" }],
        nextType: linkType,
      },
    ];

    while (queue.length > 0) {
      const { path, nextType } = queue.shift()!;
      const last = path[path.length - 1];

      if (path.length >= maxLength) continue;

      const nextLinks = this.getLinks(last.candidate, nextType);
      for (const next of nextLinks) {
        if (path.some((p) => p.candidate.equals(next))) {
          if (!this.loop) {
            continue;
          }
          const newPath = [...path, { candidate: next, type: nextType }];
          if (
            next.equals(path.at(0)!.candidate) &&
            newPath.length >= minLength &&
            newPath.length % 2 == 1
          ) {
            yield newPath;
          }
          continue;
        }

        const newPath = [...path, { candidate: next, type: nextType }];

        if (
          !this.loop &&
          newPath.length >= minLength &&
          next.getDigit() == start.getDigit() &&
          newPath.length % 2 == 0
        ) {
          yield newPath;
        }

        if (path.length < maxLength) {
          queue.push({
            path: newPath,
            nextType: nextType === "strong" ? "weak" : "strong",
          });
        }
      }
    }
  }
}

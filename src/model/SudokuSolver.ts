import Sudoku from "@/model/Sudoku";
import { Resolver } from "@/model/resolvers/AbstractResolver";
import { HiddenTupleResolver } from "@/model/resolvers/HiddenTuples";
import { NakedTupleResolver } from "@/model/resolvers/NakedTuples";
import { FishResolver } from "@/model/resolvers/Fish";
import { PointingCandidates } from "@/model/resolvers/PointingCandidates";
import { ClaimingCandidates } from "@/model/resolvers/ClaimingCandidates";
import { CPRResolver } from "@/model/resolvers/ChuteRemotePair";
import { XYWing } from "@/model/resolvers/XYWing";
import { XYZWing } from "@/model/resolvers/XYZWing";
import { XChainResolver } from "@/model/resolvers/XChain";
import { XYChainResolver } from "@/model/resolvers/XYChain";

export class SudokuSolver {
  private sudoku: Sudoku;

  private resolvers: Array<Resolver>;

  constructor(sudoku: Sudoku) {
    this.sudoku = sudoku;
    // order matters
    this.resolvers = [
      new NakedTupleResolver(this.sudoku, 1),
      new HiddenTupleResolver(this.sudoku, 1),
      new NakedTupleResolver(this.sudoku, 2),
      new HiddenTupleResolver(this.sudoku, 2),
      new NakedTupleResolver(this.sudoku, 3),
      new HiddenTupleResolver(this.sudoku, 3),
      new PointingCandidates(this.sudoku),
      new ClaimingCandidates(this.sudoku),
      new NakedTupleResolver(this.sudoku, 4),
      new HiddenTupleResolver(this.sudoku, 4),
      new NakedTupleResolver(this.sudoku, 5),
      new HiddenTupleResolver(this.sudoku, 5),
      new FishResolver(this.sudoku, 2),
      new CPRResolver(this.sudoku),
      new XYWing(this.sudoku),
      new XYZWing(this.sudoku),
      new XChainResolver(this.sudoku),
      new XYChainResolver(this.sudoku),
      new FishResolver(this.sudoku, 3),
      new FishResolver(this.sudoku, 4),
      new FishResolver(this.sudoku, 5),
    ];
  }

  public getNextStep() {
    for (const resolver of this.resolvers) {
      const res = resolver.resolve();
      if (res) {
        return res;
      }
    }
    return undefined;
  }
}

// class ChainGraph {
//   private nodes: Array<ChainNode> = [];
//   private graph: Array<Array<GraphElement>> = Array.from({ length: 81 * 9 }, () =>
//     Array(81 * 9).fill({ to: undefined, type: "none" }),
//   );

//   constructor(sudoku: Sudoku) {
//     // save nodes
//     sudoku
//       .getCells()
//       .forEach((cell) =>
//         cell.getCandidateList().forEach((cand) => this.nodes.push(new ChainNode(cell, cand))),
//       );
//     // create links
//     for (const cell of sudoku.getCells()) {
//       // between candidates within each cell
//       const candidates = cell.getCandidateList();
//       const type = candidates.length == 2 ? "strong" : "weak";

//       for (const [candidateA, candidateB] of kCombinations(candidates, 2)) {
//         this.createLink(new ChainNode(cell, candidateA), new ChainNode(cell, candidateB), type);
//       }
//     }
//     // and between cells for each candidate
//     const unitTypes = ["row", "col", "box"] as const;
//     for (const unitType of unitTypes) {
//       for (const unit of sudoku.units(unitType)) {
//         for (const candidate of unit.getCandidates()) {
//           const candidateCells = unit.getCellsWithCandidate(candidate);
//           const type = candidateCells.length == 2 ? "strong" : "weak"; // lengths 0 and 1 are implicitly impossible at this point
//           for (const [cellA, cellB] of kCombinations(candidateCells, 2)) {
//             this.createLink(new ChainNode(cellA, candidate), new ChainNode(cellB, candidate), type);
//           }
//         }
//       }
//     }
//   }

//   public getLinkedNodes(from: ChainNode) {
//     return this.graph[from.getIdx()].filter((it) => it.type != "none");
//   }

//   private createLink(nodeA: ChainNode, nodeB: ChainNode, type: "strong" | "weak") {
//     this.graph[nodeA.getIdx()][nodeB.getIdx()] = { to: nodeB, type };
//     this.graph[nodeB.getIdx()][nodeA.getIdx()] = { to: nodeA, type };
//   }

//   public getNodes() {
//     return this.nodes;
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// class SudokuChainFinder {
//   private chainGraph: ChainGraph;

//   constructor(sudoku: Sudoku) {
//     this.chainGraph = new ChainGraph(sudoku);
//   }

//   public *findChains() {
//     const allNodes = this.chainGraph.getNodes();
//     for (const startNode of allNodes) {
//       const queue: Array<{
//         current: ChainNode;
//         path: Array<GraphElement>;
//         lastType: LinkType;
//       }> = [
//         {
//           current: startNode,
//           path: [{ to: startNode, type: "strong" }],
//           lastType: "none",
//         },
//       ];

//       while (queue.length > 0) {
//         const { current, path, lastType } = queue.shift()!;

//         if (path.length >= 16) {
//           return;
//         }

//         // Determine next edge type to follow
//         const expectedType: LinkType =
//           lastType == "none"
//             ? "strong" // arbitrary first step, todo
//             : lastType === "weak"
//               ? "strong"
//               : "weak";

//         const links = this.chainGraph.getLinkedNodes(current);

//         for (const link of links) {
//           const linkType = link.type;
//           const nextNode = link.to!;

//           if (expectedType == "strong" && linkType != "strong") continue;

//           if (path.some((p) => p.to!.getIdx() == nextNode.getIdx())) {
//             if (
//               nextNode.getIdx() == startNode.getIdx() &&
//               path.length >= 4 &&
//               path.length % 2 == 0
//             ) {
//               yield [...path, { to: nextNode, type: expectedType }];
//             }
//             continue;
//           }

//           queue.push({
//             current: nextNode,
//             path: [...path, { to: nextNode, type: linkType }],
//             lastType: linkType,
//           });
//         }
//       }
//     }
//   }

//   public static stringifyChain(chain: Array<GraphElement>) {
//     if (chain.length < 1) {
//       // shouldn't be posssible
//       return "";
//     }
//     let res = "";

//     const start = chain.at(0)!;
//     res += `r${start.to!.getCell().getRowIdx() + 1}c${
//       start.to!.getCell().getColIdx() + 1
//     }v${start.to!.getCandidate() + 1}`;

//     chain.slice(1).forEach((node) => {
//       res += node.type == "weak" ? "->" : "=>";
//       res += `r${node.to!.getCell().getRowIdx() + 1}c${
//         node.to!.getCell().getColIdx() + 1
//       }v${node.to!.getCandidate() + 1}`;
//     });
//     return res;
//   }
// }

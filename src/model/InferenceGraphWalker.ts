import Candidate from "@/model/Candidate.ts";
import type { InferenceGraph, LinkType, NodeFilterFn } from "@/model/InferenceGraph";

export type InferenceChain = Array<{ from: Candidate; to: Candidate; type: LinkType }>;

export class InferenceGraphWalker {
  private graph: InferenceGraph;

  constructor(graph: InferenceGraph) {
    this.graph = graph;
  }

  public getChain(
    start: Candidate,
    targetLength: number,
    startLink: LinkType = "strong",
    endOnSameNode = false,
    endOnSameDigit = false,
    filter?: NodeFilterFn,
  ) {
    const visited = new Set<Candidate>();
    const chainMap = new Map<Candidate, InferenceChain>();
    const depthMap = new Map<Candidate, number>();
    const nextLinkMap = new Map<Candidate, LinkType>();
    const queue = [start];

    visited.add(start);
    depthMap.set(start, 0);
    nextLinkMap.set(start, startLink);

    while (queue.length > 0) {
      const current = queue.pop()!;
      const currentDepth = depthMap.get(current)!;
      const chain = chainMap.get(current) ?? [];
      if (currentDepth >= targetLength) {
        return chain;
      }
      const loopBack = endOnSameNode && currentDepth == targetLength - 1;
      const loopBackDigit = endOnSameDigit && currentDepth == targetLength - 1;
      const nodeFilter: NodeFilterFn = (node) =>
        (loopBack ? node == start : !visited.has(node)) &&
        (loopBackDigit ? node.getDigit() == start.getDigit() : true) &&
        (filter ? filter(node) : true);

      const nextLinkType = nextLinkMap.get(current)!;
      const links =
        nextLinkType == "weak"
          ? this.graph.getWeakLinksOfNode(current, nodeFilter)
          : this.graph.getStrongLinksOfNode(current, nodeFilter);

      for (const next of links) {
        depthMap.set(next, currentDepth + 1);
        chainMap.set(next, [...chain, { from: current, to: next, type: nextLinkType }]);
        visited.add(next);
        nextLinkMap.set(next, nextLinkType == "weak" ? "strong" : "weak");
        queue.push(next);
      }
    }
  }
}

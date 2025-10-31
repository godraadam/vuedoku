import type Candidate from "@/model/Candidate";
import type { difficulties } from "@/consts";
import type { InferenceChain } from "./model/InferenceGraphWalker";
import type { AbstractStrategy } from "./model/strategies/AbstractStrategy";

export type UnitType = "row" | "col" | "box" | "xchute" | "ychute";

export type PlacementResult =
  | {
      place: Candidate;
      reason: string;
    }
  | undefined;

export type PlacementFn = () => PlacementResult;
export type EliminationResult =
  | {
      candidates: Array<Candidate>;
      participants?: Array<Candidate>;
      chain?: InferenceChain;
      reason: string;
    }
  | undefined;
export type EliminationFn = () => EliminationResult;

export type Step = { reporter: AbstractStrategy } & (
  | ({ type: "place" } & PlacementResult)
  | ({ type: "eliminate" } & EliminationResult)
);

export type Difficulty = (typeof difficulties)[number];

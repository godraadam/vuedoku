import type Candidate from "@/model/Candidate";

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
      participants?: Array<Candidate>
      reason: string;
    }
  | undefined;
export type EliminationFn = () => EliminationResult;

export type Step =
  | ({ type: "place" } & PlacementResult)
  | ({ type: "eliminate" } & EliminationResult);

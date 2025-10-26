export const difficulties = ["easy", "medium", "hard", "diabolical"] as const;

export const difficultyColorMap: Record<string, string> = {
  easy: "green",
  medium: "blue",
  hard: "amber",
  diabolical: "red",
};

export const difficultyNameMap: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  diabolical: "Diabolical",
};

export const difficulties = ["easy", "medium", "hard", "diabolical", "custom"] as const;

export const difficultyColorMap: Record<string, string> = {
  easy: "green",
  medium: "blue",
  hard: "amber",
  diabolical: "red",
  custom: "fuchsia",
};

export const difficultyNameMap: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  diabolical: "Diabolical",
  custom: "Custom",
};

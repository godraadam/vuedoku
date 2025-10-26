export const difficulties = ["easy", "medium", "hard", "diabolical"] as const;

export const difficultySudokuImportMap: Record<string, string> = {
  easy: "/src/sudokus/easy.ts",
  medium: "/src/sudokus/medium.ts",
  hard: "/src/sudokus/hard.ts",
  diabolical: "/src/sudokus/diabolical.ts",
};

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

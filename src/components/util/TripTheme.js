export const THEME_KO_MAP = {
  food: "식도락",
  activity: "액티비티",
  healing: "힐링",
  etc: "기타",
  1: "식도락",
  2: "액티비티",
  3: "힐링",
  4: "기타",
};

export function toThemeKo(v) {
  if (v == null) return "-";
  const key = typeof v === "string" ? v.toLowerCase() : v;
  return THEME_KO_MAP[key] ?? "-";
}

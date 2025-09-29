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

export const THEME_KO_MAP2 = {
  food: 1,
  activity: 2,
  healing: 3,
  etc: 4,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};

export const THEME_KO_MAP3 = {
  식도락: 1,
  액티비티: 2,
  힐링: 3,
  기타: 4,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};

export function toThemeKo(v) {
  if (v == null) return "-";
  const key = typeof v === "string" ? v.toLowerCase() : v;
  return THEME_KO_MAP[key] ?? "-";
}

export function toThemeNum(v) {
  if (v == null) return "-";
  const key = typeof v === "string" ? v.toLowerCase() : v;
  return THEME_KO_MAP2[key] ?? "-";
}

export function toThemeNumKor(v) {
  if (v == null) return "-";
  const key = typeof v === "string" ? v.toLowerCase() : v;
  return THEME_KO_MAP3[key] ?? "-";
}

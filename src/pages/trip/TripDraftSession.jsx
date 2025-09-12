const KEY = "triplet:tripDraft:session";

export function loadTripDraft() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTripDraft(draft) {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ ...draft, updatedAt: Date.now() })
    );
  } catch {}
}

export function clearTripDraft() {
  sessionStorage.removeItem(KEY);
}

export function patchTripDraft(patch) {
  const prev = loadTripDraft() || {};
  saveTripDraft({ ...prev, ...patch });
}

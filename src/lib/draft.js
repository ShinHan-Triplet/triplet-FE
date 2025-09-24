import { api } from "./api";

// 초안 조회
export function getDraft() {
  return api("/api/drafts/me");
}

// 초안 부분 저장
export function patchDraft(partial) {
  return api("/api/drafts/me", { method: "PUT", body: partial });
}

// 초안 삭제
export function clearDraftRemote() {
  return api("/api/drafts/me", { method: "DELETE" });
}

// 대표사진 presign
export function presignCover({ filename, contentType }) {
  return api("/api/drafts/me/cover/presign", {
    method: "POST",
    body: { filename, contentType },
  });
}

// 대표사진 메타 저장(초안에 반영)
export function confirmCover(cover) {
  // cover = { fileName, objectKey, contentType, size, viewUrl }
  return api("/api/drafts/me/cover/confirm", { method: "POST", body: cover });
}

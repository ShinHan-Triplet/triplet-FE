import { api, setAccessToken } from "./api";

export async function logout() {
  try {
    await api("/api/auth/logout", { method: "POST" }); // 쿠키 삭제 + 서버 토큰 폐기
  } catch (_) {
    // 서버가 죽었거나 쿠키가 이미 없을 수도 → 어차피 FE 토큰은 지울 것
  } finally {
    setAccessToken(null); // access 토큰 제거
  }
}

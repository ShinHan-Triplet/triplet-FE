const portNum = process.env.REACT_APP_PORT_NUM;

export const API_BASE =
  import.meta?.env?.VITE_API_BASE ||
  `https://triplet.shinhanacademy.co.kr:8080`; // 필요 시 .env로 분리

const ACCESS_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}
export function setAccessToken(token) {
  if (token) localStorage.setItem(ACCESS_KEY, token);
  else localStorage.removeItem(ACCESS_KEY);
}
export function clearAccessToken() {
  localStorage.removeItem(ACCESS_KEY);
}

async function refreshAccessToken() {
  // 리프레시 쿠키를 보내야 하므로 credentials: 'include' 필수
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  // 백엔드가 문자열(토큰) 또는 {accessToken:"..."} 둘 중 하나일 수 있어 모두 처리
  if (!res.ok) throw new Error("refresh_failed");
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  const token = typeof body === "string" ? body : body?.accessToken;
  if (!token) throw new Error("no_token_in_refresh");
  setAccessToken(token);
  return token;
}

// 서버에 물어서 확정하는 로그인 상태 API
export async function getAuthState() {
  try {
    const me = await api("/api/me");
    return { isAuthed: !!me?.authenticated, user: me?.attrs ?? null };
  } catch (e) {
    if (e.status === 401) return { isAuthed: false, user: null };
    throw e; // 다른 오류는 위로
  }
}

/**
 * api(path, { method, headers, body, retry=true })
 * - Authorization 자동 첨부 (localStorage의 accessToken)
 * - 401이면 /api/auth/refresh 호출 → 성공하면 1회 재시도
 * - 응답 JSON이면 파싱해서 반환, 아니면 text 반환
 * - 실패 시 {status, body}를 가진 Error throw
 */
export async function api(
  path,
  { method = "GET", headers = {}, body, retry = true } = {}
) {
  const access = getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include", // ★ refresh 쿠키 포함
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...headers,
    },
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  });

  // 401 → 자동 재발급 + 1회 재시도
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
    } catch {
      clearAccessToken();
      const err = new Error("HTTP 401");
      err.status = 401;
      err.body = "unauthorized";
      throw err;
    }
    return api(path, { method, headers, body, retry: false });
  }

  const ct = res.headers.get("content-type") || "";
  const parsed = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.body = parsed;
    throw err;
  }
  return parsed;
}

export async function ensureAccessToken(loc = window.location) {
  // 1) URL ?accessToken=... 으로 넘어온 경우 우선 사용
  const params = new URLSearchParams(loc.search);
  const tokenFromQS = params.get("accessToken");
  if (tokenFromQS) {
    setAccessToken(tokenFromQS);
    // 주소창 정리
    const url = loc.pathname + (loc.hash || "");
    window.history.replaceState({}, "", url);
    return tokenFromQS;
  }

  // 2) 로컬스토리지에 있으면 그대로 사용
  const existing = getAccessToken();
  if (existing) return existing;

  // 3) 없으면 refresh 시도 (쿠키 필요 → credentials: 'include'는 api()에서 이미 사용)
  try {
    const t = await refreshAccessToken();
    return t;
  } catch (e) {
    // 리프레시 실패 ⇒ 로그인 필요
    clearAccessToken();
    throw new Error("auth_required");
  }
}

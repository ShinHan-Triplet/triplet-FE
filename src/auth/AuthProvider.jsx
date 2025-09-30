import { createContext, useContext, useEffect, useState } from "react";
import { api, setAccessToken, getAuthState } from "../lib/api";

const AuthCtx = createContext({ loading: true, isAuthed: false, user: null });

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    isAuthed: false,
    user: null,
  });

  useEffect(() => {
    (async () => {
      try {
        // 시작 시 한 번 access가 없다면 refresh로 갱신 시도
        // (api()는 401이면 내부에서 refresh 재시도도 함)
        const res = await api("/api/auth/refresh", { method: "POST" }).catch(
          () => null
        );
        if (res) {
          const token = typeof res === "string" ? res : res?.accessToken;
          if (token) setAccessToken(token);
        }
        const auth = await getAuthState(); // /api/me 로 최종 확인
        setState({ loading: false, ...auth });
      } catch {
        setState({ loading: false, isAuthed: false, user: null });
      }
    })();
  }, []);

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

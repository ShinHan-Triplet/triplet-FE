// src/pages/AuthCallback.jsx
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, setAccessToken } from "../../lib/api";

export default function LoginCheck() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 1) 리다이렉트 쿼리에서 accessToken 있으면 저장
        const params = new URLSearchParams(location.search);
        const tokenFromQS = params.get("accessToken");
        if (tokenFromQS) {
          setAccessToken(tokenFromQS);
          // 토큰이 URL에 남지 않도록 정리
          // const cleanUrl = location.pathname; // 쿼리 제거
          window.history.replaceState({}, "", location.pathname);
        } else {
          // ★ 새 방식: 쿼리 없이 왔으면 refresh로 access 발급
          const newAccess = await api("/api/auth/refresh", { method: "POST" });
          const token =
            typeof newAccess === "string" ? newAccess : newAccess?.accessToken;
          if (!token) throw new Error("no access from refresh");
          setAccessToken(token);
        }

        // 내 정보 조회
        const data = await api("/api/me");
        let attrs = null,
          authenticated = false;
        if (data && typeof data === "object" && "authenticated" in data) {
          authenticated = !!data.authenticated;
          attrs = data.attrs || null;
        } else if (typeof data === "string") {
          authenticated = data !== "anonymous";
          attrs = authenticated ? { email: data } : null;
        } else if (data && typeof data === "object") {
          authenticated = true;
          attrs = data;
        }
        if (!authenticated) {
          navigate("/login?error=unauth", { replace: true });
          return;
        }
        setMe(attrs);
      } catch (e) {
        console.error("me error:", e);
        if (e?.status === 401) setError("로그인되지 않았어요. (401)");
        else if (e?.status === 403) setError("접근 권한이 없어요. (403)");
        else if (e?.status)
          setError(
            `요청 실패 (${e.status}) ${
              typeof e.body === "string" ? e.body : ""
            }`
          );
        else setError("네트워크/CORS 문제일 수 있어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, location]);

  if (loading) return <Center>로그인 처리 중...</Center>;
  if (error) return <Center>{error}</Center>;
  if (!me) return <Center>사용자 정보를 불러올 수 없어요.</Center>;

  const { name, email, birthday, birthyear, profile_image } = me;

  return (
    <Wrap>
      <Card>
        <Top>
          {profile_image ? (
            <Avatar src={profile_image} alt="profile" />
          ) : (
            <AvatarFallback>{(name ?? "U").slice(0, 1)}</AvatarFallback>
          )}
          <UserName>{name ?? "이름(제공 안 됨)"}</UserName>
        </Top>

        <List>
          <Row>
            <Key>이메일</Key>
            <Val>{email ?? "제공 안 됨"}</Val>
          </Row>
          <Row>
            <Key>생일</Key>
            <Val>{birthday ?? "제공 안 됨"}</Val>
          </Row>
          <Row>
            <Key>출생연도</Key>
            <Val>{birthyear ?? "제공 안 됨"}</Val>
          </Row>
        </List>

        <Buttons>
          <Btn onClick={() => navigate("/", { replace: true })}>홈으로</Btn>
        </Buttons>
      </Card>

      <Debug>
        <details>
          <summary>원본 응답 보기 (디버그)</summary>
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </details>
      </Debug>
    </Wrap>
  );
}

/* ---- styled ---- */
const Center = styled.div`
  width: 100%;
  padding: 48px 0;
  text-align: center;
`;
const Wrap = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 24px;
`;
const Card = styled.div`
  width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 24px;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;
const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
`;
const AvatarFallback = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  font-size: 20px;
  border: 1px solid #eee;
`;
const UserName = styled.div`
  font-size: 20px;
  font-weight: 700;
`;
const List = styled.div`
  border-top: 1px solid #f0f0f0;
  margin-top: 12px;
  padding-top: 12px;
  display: grid;
  gap: 10px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
  align-items: center;
`;
const Key = styled.div`
  color: #6b7280;
  font-size: 14px;
`;
const Val = styled.div`
  color: #111827;
  font-size: 15px;
  word-break: break-all;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;
const Btn = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  cursor: pointer;
`;
const Debug = styled.div`
  margin-top: 12px;
  color: #6b7280;
  font-size: 12px;
  width: 420px;
`;

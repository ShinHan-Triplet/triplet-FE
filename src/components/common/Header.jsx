import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../auth/AuthProvider";
import { api, setAccessToken } from "../../lib/api";

import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import HeaderDropdown from "./HeaderDropdown";
import NotificationDropdown from "./NotificationDropdown";

import logo from "../../assets/logo/logo.svg";
import userIcon from "../../assets/icon/user.svg";
import bellIcon from "../../assets/icon/bell.svg";
import bellNewIcon from "../../assets/icon/bell-new.svg";

export default function Header({ onTabChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isAuthed } = useAuth();

  const iconRefs = useRef({ user: null, bell: null });

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/trip")) {
      setActiveTab("trip");
    } else if (path.startsWith("/card")) {
      setActiveTab("card");
    } else {
      setActiveTab(null);
    }
  }, [location.pathname]);

  const handleTab = (key) => {
    setActiveTab(key);
    onTabChange && onTabChange(key);
    if (key === "trip") {
      navigate("/trip");
    } else if (key === "card") {
      navigate("/card");
    }
  };

  const handleDropdownSelect = async (key) => {
  if (key === "mypage") {
    setDropdownOpen(false);
    navigate("/mypage");
    return;
  }

  if (key === "logout") {
    try {
      await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    } finally {
      setAccessToken(null);
      setNotifications([]);
      setDropdownOpen(false);
      setBellOpen(false);
      window.location.assign("/");
    }
  }
};

  const gotoLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!dropdownOpen && !bellOpen) return;

    const handleClickOutside = (e) => {
      const insideUser = iconRefs.current.user?.contains(e.target);
      const insideBell = iconRefs.current.bell?.contains(e.target);

      if (!insideUser) setDropdownOpen(false);
      if (!insideBell) setBellOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, bellOpen]);

  // 알림 불러오기
  const fetchInvites = async () => {
    try {
      const res = await api("/api/gather/invites/me");
      const list = (Array.isArray(res) ? res : []).map((it) => ({
        invite_id: it.inviteId,
        gather_id: it.gatherId,
        gather_name: it.gatherName,
        status: it.status,
      }));
      setNotifications(list);
    } catch (e) {
      console.error("GET /api/gather/invites/me failed", e);
    }
  };

  // 로그인 상태 변화 시 알림 데이터 최신화
  useEffect(() => {
    if (!isAuthed) {
      setNotifications([]);
      return;
    }
    fetchInvites();
  }, [isAuthed]);

  // 벨 아이콘 누르면 알림 데이터 최신화
  const toggleBell = () => {
    const next = !bellOpen;
    setBellOpen(next);
    if (next) fetchInvites();
  };

  // 초대 수락/거절
  const approve = async (n) => {
    try {
      await api(`/api/gather/invites/${n.invite_id}/accept`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((it) => (it.invite_id === n.invite_id ? { ...it, status: 2 } : it))
      );
    } catch (e) {
      console.error("accept invite failed", e);
      alert(e?.body?.message || "수락에 실패했어요.");
    }
  };
  const reject = async (n) => {
    try {
      await api(`/api/gather/invites/${n.invite_id}/reject`, { method: "PATCH" });
      setNotifications((prev) => prev.filter((it) => it.invite_id !== n.invite_id));
    } catch (e) {
      console.error("reject invite failed", e);
      alert(e?.body?.message || "거절에 실패했어요.");
    }
  };

  const isWaiting = notifications.some((n) => n.status === 1);

  return (
    <HeaderWrap>
      <Inner>
        <Logo
          onClick={() => {
            setActiveTab(null);
            navigate("/");
          }}
        >
          <img src={logo} alt="Triplet" />
        </Logo>

        <Nav>
          <TabBtn
            type="button"
            className={activeTab === "trip" ? "active" : ""}
            onClick={() => handleTab("trip")}
          >
            여행 예산
          </TabBtn>
          <TabBtn
            type="button"
            className={activeTab === "card" ? "active" : ""}
            onClick={() => handleTab("card")}
          >
            카드 발급
          </TabBtn>
        </Nav>

        <Actions>
          {!isAuthed ? (
            <LoginBtn onClick={() => gotoLogin()}>로그인 / 회원가입</LoginBtn>
          ) : (
            <IconGroup>
              <IconWrap ref={(el) => (iconRefs.current.user = el)}>
                <IconBtn
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-label="내 정보"
                >
                  <img src={userIcon} alt="내 정보" />
                </IconBtn>

                <HeaderDropdown
                  open={dropdownOpen}
                  onSelect={handleDropdownSelect}
                  onClose={() => setDropdownOpen(false)}
                />
              </IconWrap>

              <IconWrap ref={(el) => (iconRefs.current.bell = el)}>
                <IconBtn
                  onClick={toggleBell}
                  aria-haspopup="menu"
                  aria-expanded={bellOpen}
                  aria-label={isWaiting ? "새 알림 있음" : "알림"}
                >
                  <img src={isWaiting ? bellNewIcon : bellIcon} alt="알림" />
                </IconBtn>

                <NotificationDropdown
                  open={bellOpen}
                  items={notifications}
                  onApprove={approve}
                  onReject={reject}
                  onClose={() => setBellOpen(false)}
                />
              </IconWrap>
            </IconGroup>
          )}
        </Actions>
      </Inner>
    </HeaderWrap>
  );
}

const HeaderWrap = styled.header`
  width: 100%;
  height: 100px;
  background: ${colors.white};
  position: sticky;
  top: 0;
  box-shadow: 0px 6px 10px rgba(112, 112, 112, 0.1);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div`
  max-width: 1058px;
  width: 100%;
  height: 60px;
  display: grid;
  grid-template-columns: 250px 1fr auto 1fr 250px;
  align-items: center;
`;

const Logo = styled.div`
  grid-column: 1 / 2;
  width: 250px;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    height: 50px;
    display: block;
  }
`;

const Nav = styled.nav`
  grid-column: 3 / 4;
  display: flex;
  gap: 55px;
  justify-content: center;
`;

const TabBtn = styled.button`
  ${fontSet.body1_b};
  border: 0;
  background: transparent;
  color: ${colors.black};
  cursor: pointer;
  position: relative;

  &.active {
    color: ${colors.blue500};
  }
  &.active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 3px;
    background: ${colors.blue500};
  }
`;

const Actions = styled.div`
  grid-column: 5 / 6;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const LoginBtn = styled.button`
  ${fontSet.body2_b};
  height: 50px;
  padding: 8px 28px;
  color: ${colors.blue300};
  background: ${colors.white};
  border: 2px solid ${colors.blue300};
  border-radius: 999px;
  cursor: pointer;
`;

const IconGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
`;

const IconBtn = styled.button`
  border: 0;
  background: transparent;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    background: ${colors.gray200};
  }

  img {
    width: 32px;
    height: 32px;
  }
`;

const IconWrap = styled.div`
  position: relative;
  display: inline-block;
`;

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../auth/AuthProvider";

import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import HeaderDropdown from "./HeaderDropdown";
import NotificationDropdown from "./NotificationDropdown";

import logo from "../../assets/logo/logo.svg";
import userIcon from "../../assets/icon/user.svg";
import bellIcon from "../../assets/icon/bell.svg";
import bellNewIcon from "../../assets/icon/bell-new.svg";

const MOCK_GATHERS = [
  { gather_id: 5001, gather_name: "제주여행" },
  { gather_id: 5002, gather_name: "입짧은주원과 식도락" },
];

const MOCK_GATHER_INVITES = [
  {
    invite_id: 90001,
    invited_id: 101,
    gather_id: 5001,
    status: 1,
    created_at: "2025-09-10T09:12:00Z",
  },
  {
    invite_id: 90002,
    invited_id: 101,
    gather_id: 5002,
    status: 1,
    created_at: "2025-09-10T09:13:00Z",
  },
];

export default function Header({ onTabChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleDropdownSelect = (key) => {
    if (key === "mypage") {
      navigate("/mypage");
    } else if (key === "logout") {
      setIsLoggedIn(false);
      setNotifications([]);
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

  // MOCK: 로그인 시 더미 알림 데이터 로드
  useEffect(() => {
    if (!isLoggedIn) return;
    const myId = 3; // 초대받은 사용자 id
    const invitesForMe = MOCK_GATHER_INVITES.filter(
      (it) => it.invited_id === myId
    ).map((it) => ({
      ...it,
      gather_name: MOCK_GATHERS.find((g) => g.gather_id === it.gather_id)
        .gather_name,
    }));
    setNotifications(invitesForMe);
  }, [isLoggedIn]);

  const isWaiting = notifications.some((n) => n.status === 1);

  const approve = (n) => {
    setNotifications((prev) =>
      prev.map((it) =>
        it.invite_id === n.invite_id ? { ...it, status: 2 } : it
      )
    );
    // 서버 연결:  PATCH /api/gather-invites/{id} { status:2 } + gathers_mapping insert
  };
  const reject = (n) => {
    setNotifications((prev) =>
      prev.map((it) =>
        it.invite_id === n.invite_id ? { ...it, status: 3 } : it
      )
    );
    // 서버 연결:  PATCH /api/gather-invites/{id} { status:3 }
  };

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
                  onClick={() => setBellOpen((v) => !v)}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";

import logo from "../../assets/logo/logo.svg";
import userIcon from "../../assets/icon/user.svg";
import bellIcon from "../../assets/icon/bell.svg";

export default function Header({ onTabChange }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTab = (key) => {
    setActiveTab(key);
    onTabChange && onTabChange(key);

    if (key === 'trip') {
      navigate('/trip');
    } else if (key === 'card') {
      navigate('/card');
    }
  };

  return (
    <HeaderWrap>
      <Inner>
        <Logo onClick={() => navigate('/')}>
          <img src={logo} alt="Triplet" />
        </Logo>

        <Nav>
          <TabBtn
            type="button"
            className={activeTab === 'trip' ? 'active' : ''}
            onClick={() => handleTab('trip')}
          >
            여행 예산
          </TabBtn>
          <TabBtn
            type="button"
            className={activeTab === 'card' ? 'active' : ''}
            onClick={() => handleTab('card')}
          >
            카드 발급
          </TabBtn>
        </Nav>

        <Actions>
          {!isLoggedIn ? (
            <LoginBtn onClick={() => setIsLoggedIn(true)}>
              로그인 / 회원가입
            </LoginBtn>
          ) : (
            <IconGroup>
              <IconBtn onClick={() => navigate('/mypage')}>
                <img src={userIcon} alt="내 정보" />
              </IconBtn>
              <IconBtn onClick={() => navigate('/notifications')}>
                <img src={bellIcon} alt="알림" />
              </IconBtn>
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
    content: '';
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

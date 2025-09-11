import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import profile from "../../assets/img/test_profile.png"

import MyGather from "./MyGather";
import MyCard from "./MyCard";
import MyTrip from "./MyTrip";
import MediumBtn from "../../components/button/MediumBtn";

const TABS = ["gather", "card", "trip"];

export default function Mypage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = useMemo(() => {
    const fromUrl = searchParams.get("tab");
    return TABS.includes(fromUrl) ? fromUrl : "gather";
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", activeTab);
    setSearchParams(next, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  const handleTab = (key) => () => setActiveTab(key);

  return (
    <MypageWrap>
      <Container>
        <Sidebar>
          <ProfileCard>
            <ProfileImg>
              <img src={profile} alt="프로필" />
            </ProfileImg>
            <Name>신다운</Name>
            <Birth>2002. 09. 17</Birth>
          </ProfileCard>
          <NavCard>
            <NavItem className={activeTab === "gather" ? "active" : ""} onClick={handleTab("gather")}>
              내 모임
            </NavItem>
            <NavItem className={activeTab === "card" ? "active" : ""} onClick={handleTab("card")}>
              내 카드
            </NavItem>
            <NavItem className={activeTab === "trip" ? "active" : ""} onClick={handleTab("trip")}>
              내 여행기록
            </NavItem>
          </NavCard>
          <MediumBtn
            label="계정 삭제"
            bgColor={colors.white}
            textColor={colors.error}
            hoverBgColor={colors.gray200}
            width={210}
          />
        </Sidebar>

        <Content>
          {activeTab === "gather" && <MyGather />}
          {activeTab === "card" && <MyCard />}
          {activeTab === "trip" && <MyTrip />}
        </Content>
      </Container>
    </MypageWrap>
  );
}

const MypageWrap = styled.div`
  width: 100%;
  background: ${colors.gray100};
  padding: 30px 0 80px;
`;

const Container = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
`;

const CardBase = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const ProfileCard = styled(CardBase)`
 align-self: stretch;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
`;

const ProfileImg = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Name = styled.div`
  ${fontSet.body1_b};
  color: ${colors.black};
`;

const Birth = styled.div`
  ${fontSet.body3_m};
  color: ${colors.gray700};
`;

const NavCard = styled(CardBase)`
  align-self: stretch;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.button`
  ${fontSet.body2_m};
  height: auto;
  border: 0;
  border-radius: 10px;
  text-align: left;
  padding: 16px 0;
  background: transparent;
  color: ${colors.gray700};
  cursor: pointer;
  display: flex;
  justify-content: center;

  &.active {
    ${fontSet.body2_b};
    background: ${colors.blue50};
    color: ${colors.blue500};
    pointer-events: none;
  }

  &:hover {
    background: ${colors.gray100};
  }

  &.active:hover {
    background: ${colors.blue50};
  }
`;

const Content = styled.div``;
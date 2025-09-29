import styled, { css } from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import LargeBtn from "../../components/button/LargeBtn";
import { useNavigate, useLocation } from "react-router-dom";
import { loadTripDraft, clearTripDraft } from "./TripDraftSession";
import { useEffect, useRef, useState } from "react";
import scrollUpIcon from "../../assets/icon/scroll-up.svg";
import Reveal from "../../components/util/Reveal";
import background from "../../assets/img/background/trip_bg.png";
import BackgroundOrbs from "../../components/util/BackgroundOrbs";
import ThemeBtn from "../../components/button/ThemeBtn";
import TripImgRotator from "../../components/trip/TripImgRotator";
import TripWritor from "../../components/trip/TripWritor";

import mudo1 from "../../assets/img/trip/mudo1.png";
import mudo2 from "../../assets/img/trip/mudo2.png";
import mudo3 from "../../assets/img/trip/mudo3.png";
import mudo4 from "../../assets/img/trip/mudo4.png";
import DayRange from "../../components/trip/main/DayRange";
import blueEllipse from "../../assets/img/background/ellipseBlue.png";

import gather from "../../assets/img/gather.png";
import alone from "../../assets/img/alone.png";
import CardRotator from "../../components/trip/CardRotator";
import food from "../../assets/img/card/food.png";
import activity from "../../assets/img/card/activity.png";
import healing from "../../assets/img/card/healing.png";
import etc from "../../assets/img/card/etc.png";
import { getAccessToken } from "../../lib/api";

const THEMES = [
  { name: "식도락", num: 0 },
  { name: "액티비티", num: 1 },
  { name: "힐링", num: 2 },
  { name: "기타", num: 3 },
];
export default function Trip() {
  // 페이지 디자인
  const btnWrapRef = useRef(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [theme, setTheme] = useState(0);
  const [front, setFront] = useState("gather");
  const location = useLocation();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFront((prev) => (prev === "gather" ? "alone" : "gather"));
    }, 3000); // 3초마다 교체
    return () => clearInterval(interval);
  }, []);

  // 플로팅 버튼 위치 스크롤 따라 움직이도록 설정
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;
    let rafId = null;
    let target = window.scrollY;
    let current = target;

    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      current = lerp(current, target, 0.15);
      const diff = current - target;

      if (btnWrapRef.current) {
        btnWrapRef.current.style.transform = `translateY(${diff.toFixed(2)}px)`;
      }

      if (Math.abs(target - current) > 0.5) {
        rafId = requestAnimationFrame(loop);
      } else {
        if (btnWrapRef.current)
          btnWrapRef.current.style.transform = "translateY(0)";
        rafId = null;
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      if (rafId == null) {
        rafId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ==================================================================================
  // 이전 작성 내용 불러오기
  const navigate = useNavigate();

  const hasDetails = (draft) => {
    return !!(draft?.startMs && draft?.endMs);
  };

  const hasCost = (draft) => {
    const b = draft?.budgets;
    if (!b) return false;
    const top = !!b.stay || !!b.insurance;
    const days = Object.values(b.days ?? {}).some((d) => {
      if (!d) return false;
      if (d.noSchedule) return true;
      const a = d.amounts ?? {};
      return !!(a.food || a.transport || a.leisure || a.etc);
    });
    return top || days;
  };

  const goNext = () => {
    const token = getAccessToken();
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }
    const draft = loadTripDraft();

    if (!draft || (!hasDetails(draft) && !hasCost(draft))) {
      navigate("/trip/new/details");
      return;
    }

    const ok = window.confirm(
      "이전에 작성한 내용이 있어요. 이어서 작성할까요?"
    );
    if (!ok) {
      clearTripDraft();
      navigate("/trip/new/details");
      return;
    }
    if (hasCost(draft)) {
      navigate("/trip/new/cost");
    } else navigate("/trip/new/details");
  };

  return (
    <>
      <BgWrap>
        <img
          src={background}
          alt="메인 배경"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <MainTextContent>
          <MainTextWrap>
            <Heading1>여행의 시작은 예산부터,</Heading1>
            <MainHeading>Triplet에서 똑똑하게</MainHeading>
            <LargeBtn
              label="여행 예산 세우러 가기"
              onClick={goNext}
              width={340}
            ></LargeBtn>
          </MainTextWrap>
        </MainTextContent>

        <MainInfo>
          <BackgroundOrbs
            orbs={[
              {
                x: "0%",
                y: "5%",
                size: 540,
                color: "rgba(255, 248, 229, 1)",
                dir: "left",
                delay: 0.1,
                blur: 72,
              },
              {
                x: "55%",
                y: "25%",
                size: 700,
                color: "rgba(255, 248, 229, 1)",
                dir: "right",
                delay: 0.2,
                blur: 80,
              },
              {
                x: "25%",
                y: "65%",
                size: 380,
                color: "rgba(255, 248, 229, 1)",
                dir: "up",
                delay: 0.3,
                blur: 64,
              },
            ]}
          />
          <div className="content">
            <Reveal dir="up" delay={0.02}>
              <MainInfoTitle>여행 계획 세우기</MainInfoTitle>
            </Reveal>
            <MainInfoDescWrap>
              <Reveal dir="right" delay={0.08}>
                <MainInfoDesc>
                  여행명·테마·기간을 적고 대표 사진을 올려요.
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.16}>
                <MainInfoDesc>
                  이 한 번의 입력이 다음 단계들을 똑똑하게 채워줘요.
                </MainInfoDesc>
              </Reveal>
            </MainInfoDescWrap>

            <Reveal dir="up" delay={0.24}>
              <Step1Content>
                <TripImgRotator
                  images={[mudo1, mudo2, mudo3, mudo4]}
                  index={imgIndex}
                />

                <Content>
                  <TripTitle>여행 이름</TripTitle>
                  <TripWritor
                    onAdvance={(nextTextIndex) => {
                      setImgIndex(nextTextIndex % 4);
                      setTheme(nextTextIndex % 4);
                    }}
                  />
                  <Grid2X2>
                    {THEMES.map((t) => (
                      <ThemeBtn
                        key={t.num}
                        label={t.name}
                        selected={theme === t.num}
                        width={160}
                        textColor={colors.black}
                        pointerEvents={"none"}
                      />
                    ))}
                  </Grid2X2>
                </Content>
              </Step1Content>
            </Reveal>
          </div>
        </MainInfo>

        <MainInfo>
          <div className="content">
            <Reveal dir="up" delay={0.02}>
              <MainInfoTitle>예산은 미리, 고민은 적게</MainInfoTitle>
            </Reveal>
            <MainInfoDescWrap>
              <Reveal dir="right" delay={0.08}>
                <MainInfoDesc>
                  기간에 맞춰 일자별 예산 칸이 자동으로 늘어나요.
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.16}>
                <MainInfoDesc>
                  일정 없는 날은 체크만 - 나중에 실제 사용과 비교한 레포트가
                  나와요
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.24}>
                <DayRange />
              </Reveal>
            </MainInfoDescWrap>

            <Reveal dir="up" delay={0.2}>
              <Step1Content></Step1Content>
            </Reveal>
          </div>
        </MainInfo>

        <MainInfo>
          <div className="content">
            <BlueEllipse />
            <Reveal dir="up" delay={0.02}>
              <MainInfoTitle>이멤버 리멤버:remember</MainInfoTitle>
            </Reveal>
            <MainInfoDescWrap>
              <Reveal dir="right" delay={0.08}>
                <MainInfoDesc>
                  지난 모임 이어가기 / 새 모임 만들기 / 혼자 떠나기
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.16}>
                <MainInfoDesc>
                  선택 즉시 여행과 모임이 자동으로 연결돼요.
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.24}>
                <Wrapper>
                  <Card
                    type="gather"
                    $active={front === "gather"}
                    style={{ zIndex: front === "gather" ? 2 : 1 }}
                  />
                  <Card
                    type="alone"
                    $active={front === "alone"}
                    style={{ zIndex: front === "alone" ? 2 : 1 }}
                  />
                </Wrapper>
              </Reveal>
            </MainInfoDescWrap>

            <Reveal dir="up" delay={0.2}>
              <Step1Content></Step1Content>
            </Reveal>
          </div>
        </MainInfo>

        <MainInfo>
          <div className="content">
            <Reveal dir="up" delay={0.02}>
              <MainInfoTitle>여행 테마에 맞춘 카드 추천</MainInfoTitle>
            </Reveal>
            <MainInfoDescWrap>
              <Reveal dir="right" delay={0.08}>
                <MainInfoDesc>
                  여행 테마에 딱 맞는 카드만 보여줘요.
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.16}>
                <MainInfoDesc>
                  추천에서 바로 발급, 모임에 연결까지 한 번에 연결해요.
                </MainInfoDesc>
              </Reveal>
              <Reveal dir="right" delay={0.24}>
                <Grid4X1>
                  {THEMES.map((t) => (
                    <ThemeBtn
                      key={t.num}
                      label={t.name}
                      selected={theme === t.num}
                      width={160}
                      textColor={colors.black}
                      pointerEvents={"none"}
                    />
                  ))}
                </Grid4X1>
                <CardRotator
                  images={[food, activity, healing, etc]}
                  index={imgIndex}
                />
              </Reveal>
            </MainInfoDescWrap>

            <Reveal dir="up" delay={0.2}>
              <Step1Content></Step1Content>
            </Reveal>
          </div>
        </MainInfo>
      </BgWrap>

      <FloatingBtnWrap ref={btnWrapRef}>
        <FloatingBtn onClick={handleScrollTop} aria-label="상단으로">
          <img src={scrollUpIcon} alt="" />
        </FloatingBtn>
      </FloatingBtnWrap>
    </>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 600px;
  height: 280px;
  margin-top: 80px;
`;
const Card = styled.div`
  position: absolute;
  width: 600px;
  height: 280px;
  background: ${({ type }) =>
    type === "gather"
      ? `url(${gather}) no-repeat center/contain`
      : `url(${alone}) no-repeat center/contain`};

  /* 겹치도록 위치 조정 */
  ${({ type }) =>
    type === "gather"
      ? css`
          top: 20px;
          left: -80px;
        `
      : css`
          top: -80px;
          left: 80px;
        `}

  transition: transform 0.4s ease, opacity 0.4s ease;
  opacity: ${({ $active }) => ($active ? 1 : 0.2)};
  transform: ${({ $active }) =>
    $active ? "scale(1) translate(0,0)" : "scale(0.9)"};
`;

const BlueEllipse = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1536px;
  height: 800px;
  background: url(${blueEllipse}) no-repeat center/contain;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
`;

const Step1Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 100px;
  margin-top: 80px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TripTitle = styled.div`
  ${fontSet.body2_m};
  color: ${colors.black};
  align-self: flex-start;
  margin-bottom: 20px;
`;

const Grid2X2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  margin-top: 40px;
`;

const Grid4X1 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  margin-top: 40px;
  margin-bottom: 60px;
`;

const MainTextContent = styled.div`
  position: absolute;
  top: 320px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  z-index: 20;
`;

const MainTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Heading1 = styled.div`
  ${fontSet.heading1};
  color: ${colors.black};
`;

const MainHeading = styled.div`
  ${fontSet.mainHeading};
  color: ${colors.black};
  margin-bottom: 140px;
`;

const FloatingBtnWrap = styled.div`
  position: fixed;
  right: 50px;
  bottom: 60px;
  z-index: 2000;
  will-change: transform;
`;

const MainInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 200px 0 300px;
  position: relative;

  & > .content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & > .content > div:last-child {
    align-self: flex-start;
  }
`;

const MainInfoTitle = styled.div`
  ${fontSet.heading3};
  color: ${colors.blue500};
  text-align: center;
  z-index: 20;
`;

const MainInfoDescWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 36px;
`;

const MainInfoDesc = styled.div`
  ${fontSet.heading2};
  color: ${colors.black};
  text-align: center;
`;

const FloatingBtn = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${colors.white};
  border: 2px solid ${colors.blue200};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    background: ${colors.gray100};
  }
`;

const BgWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;

  & > div:last-child {
    margin: 200px 0 0;
  }
`;

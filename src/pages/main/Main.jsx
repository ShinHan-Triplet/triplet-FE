import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import colors from "../../styles/colors";
import fontSet from '../../styles/fonts';
import background from "../../assets/img/background/main_bg.png";
import first1 from "../../assets/img/main/first_1.png";
import first2 from "../../assets/img/main/first_2.png";
import secondCard from "../../assets/img/main/second_card.png";
import ellipse from "../../assets/img/main/ellipse_yellow.png";
import scrollUpIcon from '../../assets/icon/scroll-up.svg';
import Reveal from '../../components/util/Reveal';
import BackgroundOrbs from '../../components/util/BackgroundOrbs';
import ProgressBar from "../../components/mypage/ProgressBar";

const carouselCats = ['전체', '식비', '교통비', '여가비', '기타'];
const costs = {
  total: {
    전체: 200000,
    식비: 60000,
    교통비: 50000,
    여가비: 40000,
    기타: 100000,
  },
  used: {
    전체: 160000,
    식비: 36000,
    교통비: 70000,
    여가비: 30000,
    기타: 80000,
  },
};

export default function Main() {
  const btnWrapRef = useRef(null);
  const [carIdx, setCarIdx] = useState(0);

  const len = carouselCats.length;
  const centerCat = carouselCats[carIdx];
  const leftCat   = carouselCats[(carIdx + len - 1) % len];
  const rightCat  = carouselCats[(carIdx + 1) % len]; 

  useEffect(() => {
    const id = setInterval(() => {
      setCarIdx((i) => (i + 1) % carouselCats.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 플로팅 버튼 위치 스크롤 따라 움직이도록 설정
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        if (btnWrapRef.current) btnWrapRef.current.style.transform = 'translateY(0)';
        rafId = null;
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      if (rafId == null) {
        rafId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <BgWrap>
      <img src={background} alt="메인 배경" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <MainTextContent>
        <MainTextWrap>
          <Heading1>여행도 일상도, 하나의 흐름으로</Heading1>
          <MainHeading>Triplet에서 한눈에</MainHeading>
        </MainTextWrap>
        <SubTextWrap>
          <Reveal dir="up" delay={0.00}>
            <SubText>여행에서 가장 번거로운 돈 관리를</SubText>
          </Reveal>
          <Reveal dir="up" delay={0.06}>
            <SubText>계획 · 기록 · 정리까지 한 흐름으로 단순하게 만듭니다.</SubText>
          </Reveal>
        </SubTextWrap>
        <Reveal dir="up" delay={0.12}>
          <LastText>누구와 어디서든, Triplet으로 한눈에 정리하세요.</LastText>
        </Reveal>
      </MainTextContent>

      <MainInfo>
        <BackgroundOrbs
          orbs={[
            { x: '0%', y: '5%', size: 540, color: 'rgba(226, 241, 255, 1)', dir: 'left',  delay: 0.1, blur: 72 },
            { x: '55%', y: '25%', size: 700, color: 'rgba(226, 241, 255, 1)', dir: 'right', delay: 0.2, blur: 80 },
            { x: '25%', y: '65%', size: 380, color: 'rgba(226, 241, 255, 1)', dir: 'up',    delay: 0.3, blur: 64 },
          ]}
        />
        <div className="content">
          <Reveal dir="up" delay={0.02}>
            <MainInfoTitle>Planning : 계획은 가볍게, 기준은 확실하게</MainInfoTitle>
          </Reveal>
          <MainInfoDescWrap>
            <Reveal dir="right" delay={0.08}>
              <MainInfoDesc>여행 일정과 멤버를 선택하고</MainInfoDesc>
            </Reveal>
            <Reveal dir="right" delay={0.16}>
              <MainInfoDesc>카테고리별 한도를 정해요.</MainInfoDesc>
            </Reveal>
          </MainInfoDescWrap>

          <Reveal dir="up" delay={0.20}>
            <MainFigure className="shift-left">
              <img
                src={first1}
                alt="예산/카테고리 설정"
                onLoad={(e) => {
                  e.currentTarget.style.width = Math.round(e.currentTarget.naturalWidth / 2) + 'px';
                }}
              />
              <img
                className="float"
                src={first2}
                alt="모임/멤버 선택"
                onLoad={(e) => {
                  e.currentTarget.style.width = Math.round(e.currentTarget.naturalWidth / 2) + 'px';
                }}
              />
            </MainFigure>
          </Reveal>
        </div>
      </MainInfo>

      <MainInfo>
        <img className="section-ellipse" src={ellipse} alt="" aria-hidden="true" />
        <Reveal dir="up" delay={0.02}>
          <MainInfoTitle>On Trip : 예산 현황, 실시간으로 한눈에</MainInfoTitle>
        </Reveal>
        <MainInfoDescWrap>
          <Reveal dir="right" delay={0.08}>
            <MainInfoDesc>카테고리별 지출과 잔여 예산을</MainInfoDesc>
          </Reveal>
          <Reveal dir="right" delay={0.16}>
            <MainInfoDesc>실시간으로 확인하세요.</MainInfoDesc>
          </Reveal>
        </MainInfoDescWrap>

        <Reveal dir="up" delay={0.20}>
          <MainFigure>
            <img
              src={secondCard}
              alt="카드내역"
              onLoad={(e) => {
                e.currentTarget.style.width = Math.round(e.currentTarget.naturalWidth / 3) + 'px';
              }}
             />

            <SideBanner className="side left">
              <div className="shrink">
                <ProgressBar
                  category={leftCat}
                  used={costs.used[leftCat]}
                  total={costs.total[leftCat]}
                />
              </div>
            </SideBanner>

            <SideBanner className="side right">
              <div className="shrink">
                <ProgressBar
                  category={rightCat}
                  used={costs.used[rightCat]}
                  total={costs.total[rightCat]}
                />
              </div>
            </SideBanner>

            <div className="overlay">
              <ProgressBar
                category={centerCat}
                used={costs.used[centerCat]}
                total={costs.total[centerCat]}
              />
            </div>
          </MainFigure>
        </Reveal>
      </MainInfo>

      <MainInfo>
        <Reveal dir="up" delay={0.02}>
          <MainInfoTitle>Memories : 여행의 모든 순간을 기록하다</MainInfoTitle>
        </Reveal>
        <MainInfoDescWrap>
          <Reveal dir="right" delay={0.08}>
            <MainInfoDesc>여행 일정부터 테마, 동행자, 예산까지</MainInfoDesc>
          </Reveal>
          <Reveal dir="right" delay={0.16}>
            <MainInfoDesc>한 페이지에 모두 담아 기록해요.</MainInfoDesc>
          </Reveal>
        </MainInfoDescWrap>
      </MainInfo>

      <FloatingBtnWrap ref={btnWrapRef}>
        <FloatingBtn onClick={handleScrollTop} aria-label="상단으로">
          <img src={scrollUpIcon} alt="" />
        </FloatingBtn>
      </FloatingBtnWrap>
    </BgWrap>
  );
}

const BgWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const FloatingBtnWrap = styled.div`
  position: fixed;
  right: 50px;
  bottom: 60px;
  z-index: 2000;
  will-change: transform;
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
`;

const SubTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 400px;
`;

const SubText = styled.div`
  ${fontSet.heading2};
  color: ${colors.black};
`;

const LastText = styled.div`
  margin-top: 36px;
  display: flex;
  justify-content: center;
  ${fontSet.heading2};
  color: ${colors.black};
  z-index: 10;
`;

const MainInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 200px 0;
  position: relative;

  & > img.section-ellipse {
    position: absolute;
    z-index: 0;
    left: 50%;
    top: -150px; 
    transform: translateX(-50%);
    width: 120vw;
    max-width: none;
    height: auto;
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
  }

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
`;

const MainInfoDescWrap = styled.div`
  display: flex;
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

const MainFigure = styled.figure`
  position: relative;
  margin: 120px 0 240px;
  max-width: 92vw;

  isolation: isolate;

  --barTop: 280px;
  --barSidePadding: 70px;
  --barWidth: calc(100% - (var(--barSidePadding) * 2));
  --sideWidth: 260px;
  --sideGap: 20px; 

  &.shift-left { margin-left: -240px; }

  & > img {
    position: relative;
    z-index: 1;
    display: block;
    height: auto;
    max-width: 100%;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 16px 36px rgba(0,0,0,0.10);
  }

  & > .overlay {
    position: absolute;
    z-index: 5;
    left: 50%;
    transform: translateX(-50%);
    top: var(--barTop);
    width: var(--barWidth);
    pointer-events: auto;
  }

  & > img.float {
    position: absolute;
    right: -350px;
    bottom: -160px;
    border-radius: 10px;
    box-shadow: 0 16px 36px rgba(0,0,0,0.10);
  }
`;

const SideBanner = styled.div`
  position: absolute;
  z-index: 3;
  top: var(--barTop);
  width: var(--barWidth);
  pointer-events: auto;

  &.left  { right: calc(100% - 40px); }
  &.right { left:  calc(100% - 40px); }

  .shrink { transform: none; }
`;

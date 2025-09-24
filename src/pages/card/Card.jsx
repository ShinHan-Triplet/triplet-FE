import styled, { keyframes, css } from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LargeBtn from "../../components/button/LargeBtn";
import sampleCard from "./../../assets/img/test_thumbnail.png";
import left from "./../../assets/icon/chevron-left.svg";
import right from "./../../assets/icon/chevron-right.svg";
import { api, setAccessToken } from "../../lib/api";
import { getCardCoverById } from "../../assets/cardCoverBasic";

const shine = keyframes`
  from { transform: translateX(-120%) skewX(-20deg); }
  to   { transform: translateX(220%)  skewX(-20deg); }
`;

export default function Card() {
  // state들 추가
  const [busy, setBusy] = useState(false); // 연타 방지
  const [phase, setPhase] = useState({ left: "to", right: "to" }); // 들어오는 슬롯 애니메이션 단계
  const [idx, setIdx] = useState(0);
  const [cardList, setCardList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackImg = sampleCard;

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(location.search);
        const tokenFromQS = params.get("accessToken");
        if (tokenFromQS) {
          setAccessToken(tokenFromQS);
          window.history.replaceState({}, "", location.pathname);
        } else {
          const newAccess = await api("/api/auth/refresh", { method: "POST" });
          const token =
            typeof newAccess === "string" ? newAccess : newAccess?.accessToken;
          if (!token) throw new Error("no access from refresh");
          setAccessToken(token);
        }

        const res = await api(`/api/card/list`, { method: "GET" });
        const toUI = (c) => {
          const descStr = c.cardDesc;
          const desc = Array.isArray(descStr)
            ? descStr
            : String(descStr)
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean);

          const benefits = c.benefits.map((b) => ({
            title: b.title,
            content: b.content,
          }));

          return {
            id: c.cardId,
            name: c.cardName,
            tagline: c.cardIntro,
            desc,
            benefits,
            image: getCardCoverById?.(c.cardId) || fallbackImg,
          };
        };

        const cards = res.map(toUI);
        console.log(cards);
        setCardList(cards);
        setIdx(0); // 처음으로 정렬
      } catch (e) {
        // 실패 시에도 12개 유지(플레이스홀더)

        setIdx(0);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // 토큰 쿼리 정리 후 재요청 방지

  const animate = (direction) => {
    if (busy) return;
    setBusy(true);

    // 들어오는 쪽 슬롯을 'from'(오프캔버스)로 세팅
    if (direction === -1) setPhase((p) => ({ ...p, left: "from" }));
    if (direction === 1) setPhase((p) => ({ ...p, right: "from" }));

    // 다음 프레임에 'to'(자리)로 전환 + 인덱스 이동 -> transition 발동
    requestAnimationFrame(() => {
      if (direction === -1) setPhase((p) => ({ ...p, left: "to" }));
      if (direction === 1) setPhase((p) => ({ ...p, right: "to" }));
      setIdx((v) => (v + direction + n) % n);
    });

    // transition 끝나면 idle
    setTimeout(() => {
      setBusy(false);
    }, 450); // transition 420ms + 여유
  };

  const goLeft = () => animate(-1);
  const goRight = () => animate(1);
  //====================================================

  const n = cardList.length;
  const current = cardList[idx];
  const prevIdx = (idx - 1 + n) % n;
  const nextIdx = (idx + 1) % n;
  const prevCard = n > 1 ? cardList[prevIdx] : null;
  const nextCard = n > 1 ? cardList[nextIdx] : null;
  const imgOr = (img) => img || fallbackImg;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goLeft();
      if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const gotoApply = () => {
    const prev2Url = location.pathname;
    navigate(`/card/${current.id}/apply`, {
      state: { card: current, prev2Url },
    });
    sessionStorage.setItem("triplet:selectedCardId", current.id);
  };

  const centerRef = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(0);
  const [centerHovered, setCenterHovered] = useState(false);

  const setVars = (rx, ry, liftPx) => {
    const el = centerRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--lift", liftPx);
  };

  const measure = () => {
    if (centerRef.current) {
      rectRef.current = centerRef.current.getBoundingClientRect();
    }
  };

  const resetTilt = () => {
    setVars(0, 0, "0px");
    rectRef.current = null;
    setCenterHovered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  };

  const onCenterEnter = () => {
    setCenterHovered(true);
    measure(); // 좌표 1회 측정
    setVars(0, 0, "-2px"); // 살짝 들어올림
  };

  const onCenterMove = (e) => {
    const r = rectRef.current || (measure(), rectRef.current);
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const MAX = 10;
    const ry = (px - 0.5) * (MAX * 2);
    const rx = -(py - 0.5) * (MAX * 2);

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setVars(rx, ry, "-2px"); // 렌더 없이 CSS 변수만 갱신
        rafRef.current = 0;
      });
    }
  };

  const onCenterLeave = resetTilt;

  useEffect(() => {
    // 뷰포트 변경/스크롤로 좌표가 틀어지면 리셋
    const onResize = resetTilt;
    const onScroll = resetTilt;
    const onVis = () => document.hidden && resetTilt();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <Container>
        <CardText>
          <MainText>원하는 혜택만 담은 카드</MainText>
          <SubTextList>
            <SubText>자주 쓰는 지출에 혜택을 집중했어요.</SubText>
            <SubText>
              필요한 순간, 필요한 곳에서 자연스럽게 아낄 수 있습니다.
            </SubText>
          </SubTextList>
        </CardText>
      </Container>

      <Carousel>
        <ArrowButton aria-label="이전 카드" onClick={goLeft}>
          <img src={left} alt="" />
        </ArrowButton>

        <CardsRow>
          {prevCard && (
            <CarouselCard
              key={prevCard.id}
              $img={imgOr(prevCard.image)}
              $pos="left"
              $phase={phase.left}
              role="button"
              aria-label="이전 카드 선택"
              onClick={goLeft}
            />
          )}
          {current && (
            <CarouselCard
              ref={centerRef}
              key={current.id}
              $img={imgOr(current.image)}
              $pos="center"
              aria-label={current.name}
              role="img"
              data-hovered={centerHovered ? "true" : undefined}
              onMouseEnter={onCenterEnter}
              onMouseMove={onCenterMove}
              onMouseLeave={onCenterLeave}
            />
          )}
          {nextCard && (
            <CarouselCard
              key={nextCard.id}
              $img={imgOr(nextCard.image)}
              $pos="right"
              $phase={phase.right}
              role="button"
              aria-label="다음 카드 선택"
              onClick={goRight}
            />
          )}
        </CardsRow>

        <ArrowButton aria-label="다음 카드" onClick={goRight}>
          <img src={right} alt="" />
        </ArrowButton>
      </Carousel>

      <Details>
        <Title>{current?.name ?? "카드"}</Title>
        <Tagline>{current?.tagline ?? ""}</Tagline>
        <DescList>
          {(current?.desc ?? []).map((b, i) => (
            <Desc key={i}>{b}</Desc>
          ))}
        </DescList>
        <Line />
        <ListTitle>주요 혜택</ListTitle>
        <BenefitList>
          {(current?.benefits ?? []).map((b, i) => (
            <Benefit key={i}>
              <BenefitTitle>{b.title}</BenefitTitle>
              <BenefitContent>{b.content}</BenefitContent>
            </Benefit>
          ))}
        </BenefitList>
        <Line />
      </Details>
      <BtnSpace>
        <LargeBtn
          label="카드 발급하기"
          onClick={gotoApply}
          bgColor={colors.blue400}
          textColor={colors.white}
          width={220}
        ></LargeBtn>
      </BtnSpace>
    </>
  );
}

const Carousel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 131px;
  margin-bottom: 120px;
`;

const CardsRow = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 760px;
  height: 340px;
`;

const CarouselCard = styled.div`
  position: absolute;
  top: 0;
  width: 240px;
  height: 319px;
  background: ${(p) => `url(${p.$img}) center / cover no-repeat`};
  transform-origin: center center;
  border-radius: 4px;
  overflow: hidden;

  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms ease,
    box-shadow 420ms ease;
  will-change: transform, filter;

  ${({ $pos, $phase }) => {
    // 기본 위치(슬롯 자리)
    const baseX = $pos === "left" ? -280 : $pos === "right" ? 280 : 0; // center
    const baseScale = $pos === "center" ? 1.2 : 0.9;

    // 'from'이면 더 멀리서 진입 (오프캔버스)
    const isFrom = $phase === "from";
    const off = 560; // 오프캔버스 거리(필요 시 조절)

    const x =
      $pos === "left"
        ? isFrom
          ? -off
          : baseX
        : $pos === "right"
        ? isFrom
          ? off
          : baseX
        : baseX;

    const filt = $pos === "center" ? "none" : "saturate(0.85) brightness(0.6)";
    const z = $pos === "center" ? 2 : 1;
    const pe = "auto";

    return css`
      transform: translate3d(${x}px, 0, 0) scale(${baseScale})
        rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))
        translateY(var(--lift, 0px));
      filter: ${filt};
      z-index: ${z};
      pointer-events: ${pe};

      ${$pos !== "center"
        ? `
          cursor: pointer;
      &:hover{
      filter: brightness(0.9);
      transform: translate3d(${x}px, 0, 0) scale(1);
      }
      `
        : css`
          &::after{
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
            transform: translateX(-120%) skewX(-20deg);
            opacity: 0;
            }
          &[data-hovered="true"]::after{
            opacity: 1;
            animation: ${shine} 900ms ease 0ms 1 both;
          `}
    `;
  }}
`;

const ArrowButton = styled.button`
  width: 140px;
  height: 140px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(1);
  }
`;

const Details = styled.div`
  width: 100%;
  background: rgba(226, 241, 255, 0.3);
  //   opacity: 0.3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0px;
`;

const Title = styled.h3`
  ${fontSet.heading2}
  color: ${colors.blue500};
  margin-bottom: 16px;
`;

const Tagline = styled.p`
  ${fontSet.body2_b}
  color: ${colors.black};
  margin-bottom: 20px;
`;
const DescList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 36px;
`;
const Desc = styled.div`
  ${fontSet.body3_b}
  color: ${colors.gray600};
  height: 19px;
`;

const Line = styled.div`
  width: 760px;
  height: 1px;
  background: ${colors.gray300};
`;

const ListTitle = styled.div`
  ${fontSet.body2_b}
  color: ${colors.black};
  margin-bottom: 22px;
  margin-top: 24px;
`;

const Benefit = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;
const BenefitTitle = styled.div`
  ${fontSet.body3_m}
  color: ${colors.black};
`;
const BenefitContent = styled.div`
  ${fontSet.detail}
  color: ${colors.gray600};
`;

const BenefitList = styled.div`
  display: grid;
  gap: 16px;
  list-style: disc;
  margin-bottom: 24px;
`;

const CardText = styled.div`
  width: 1060px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
`;

const SubTextList = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 12px;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  background: transparent;
  margin-top: 100px;
`;

const BtnSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

const MainText = styled.div`
  ${fontSet.heading2}
  text-align: center;
`;
const SubText = styled.div`
  ${fontSet.body1_b}
  color: ${colors.gray600}
`;

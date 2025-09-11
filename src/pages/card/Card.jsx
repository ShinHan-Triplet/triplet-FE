import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LargeBtn from "../../components/button/LargeBtn";
import sampleCard from "./../../assets/img/test_thumbnail.png";
import card1 from "./../../assets/img/card1.png";
import card2 from "./../../assets/img/card2.png";
import left from "./../../assets/icon/chevron-left.svg";
import right from "./../../assets/icon/chevron-right.svg";

const CARD_DATA = [
  {
    id: "foodie",
    name: "Triplet 식도락 카드",
    tagline: "맛있게 플러스만큼 더 알뜰해지는 여행 파트너",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    benefits: [
      { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
      { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
      { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
      { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
    ],
    image: sampleCard,
  },
  {
    id: "activity",
    name: "Triplet 액티비티 카드",
    tagline: "레저·교통 특화로 더 가볍게 즐기기",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    benefits: [
      { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
      { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
      { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
      { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
    ],
    image: card1,
  },
  {
    id: "shopping",
    name: "Triplet 쇼핑 카드",
    tagline: "기념품·면세 쇼핑이 많은 여행에",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    benefits: [
      { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
      { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
      { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
      { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
    ],
    image: card2,
  },
  {
    id: "shopping2",
    name: "Triplet 쇼핑 카드",
    tagline: "기념품·면세 쇼핑이 많은 여행에",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    benefits: [
      { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
      { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
      { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
      { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
    ],
    image: card1,
  },
];

export default function Card() {
  // state들 추가
  const [busy, setBusy] = useState(false); // 연타 방지
  const [dir, setDir] = useState(0); // -1: left, 1: right, 0: idle
  const [phase, setPhase] = useState({ left: "to", right: "to" }); // 들어오는 슬롯 애니메이션 단계
  const [idx, setIdx] = useState(0);

  const animate = (direction) => {
    if (busy) return;
    setBusy(true);
    setDir(direction);

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
      setDir(0);
      setBusy(false);
    }, 450); // transition 420ms + 여유
  };

  const goLeft = () => animate(-1);
  const goRight = () => animate(1);
  //====================================================
  const navigate = useNavigate();

  const n = CARD_DATA.length;
  const current = CARD_DATA[idx];
  const prevIdx = (idx - 1 + n) % n;
  const nextIdx = (idx + 1) % n;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goLeft();
      if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const gotoApply = () => {
    navigate(`/card/${current.id}/apply`, { state: { card: current } });
    sessionStorage.setItem("triplet:selectedCardId", current.id);
  };

  return (
    <>
      <Container>
        <CardText>
          <MainText>
            함께 쓰는 여행 경비에 꼭 맞는 카드, Triplet에서 준비했어요.
          </MainText>
          <SubTextList>
            <SubText>모임통장과 연결해 쓸 수 있는 다양한 카드 중에서,</SubText>
            <SubText>
              당신의 여행 스타일에 가장 잘 어울리는 카드를 선택해보세요.
            </SubText>
          </SubTextList>
        </CardText>
      </Container>

      <Carousel>
        <ArrowButton aria-label="이전 카드" onClick={goLeft}>
          <img src={left} alt="" />
        </ArrowButton>

        <CardsRow>
          <CarouselCard
            key={CARD_DATA[prevIdx].id}
            $img={CARD_DATA[prevIdx].image}
            $pos="left"
            $phase={phase.left} // ← 추가
            role="button"
            aria-label="이전 카드 선택"
            onClick={goLeft}
          />
          <CarouselCard
            key={current.id}
            $img={current.image}
            $pos="center"
            aria-label={current.name}
            role="img"
          />
          <CarouselCard
            key={CARD_DATA[nextIdx].id}
            $img={CARD_DATA[nextIdx].image}
            $pos="right"
            $phase={phase.right} // ← 추가
            role="button"
            aria-label="다음 카드 선택"
            onClick={goRight}
          />
        </CardsRow>

        <ArrowButton aria-label="다음 카드" onClick={goRight}>
          <img src={right} alt="" />
        </ArrowButton>
      </Carousel>

      <Details>
        <Title>{current.name}</Title>
        <Tagline>{current.tagline}</Tagline>
        <DescList>
          {current.desc.map((b, i) => (
            <Desc key={i}>{b}</Desc>
          ))}
        </DescList>
        <Line />
        <ListTitle>주요 혜택</ListTitle>
        <BenefitList>
          {current.benefits.map((b, i) => (
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
          label="다음"
          onClick={gotoApply}
          bgColor={colors.blue400}
          textColor={colors.white}
          width={180}
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
    const pe = $pos === "center" ? "none" : "auto";

    return `
      transform: translate3d(${x}px, 0, 0) scale(${baseScale});
      filter: ${filt};
      z-index: ${z};
      pointer-events: ${pe};

      ${
        $pos !== "center"
          ? `
          cursor: pointer;
      &:hover{
      filter: brightness(0.9);
      transform: translate3d(${x}px, 0, 0) scale(1);
      }
      `
          : ""
      }
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
  margin: 0 auto;
  width: 1060px;
  flex-direction: column;
  align-items: flex-start;
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
  ${fontSet.heading3}
  color: ${colors.gray700}
`;

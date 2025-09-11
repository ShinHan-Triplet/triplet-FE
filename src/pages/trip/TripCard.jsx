import React, { useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import DetailBtn from "../../components/button/DetailBtn";
import testThumbnail from "./../../assets/img/test_thumbnail.png";
import card1 from "./../../assets/img/card1.png";
import card2 from "./../../assets/img/card2.png";

import MediumBtn from "../../components/button/MediumBtn";
import ModalForCard from "../../components/modal/ModalForCard";
import { useNavigate, useLocation } from "react-router-dom";

const cardList = [
  {
    id: 1,
    name: "Triplet 식도락 카드",
    state: true,
    tagline: "맛있게 즐길수록 더 알뜰해지는 여행 파트너",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    subBenefits: [
      { exp: "외식·배달·편의점", num: "10% 할인" },
      { exp: "쇼핑·주유·생활", num: "5~10% 할인" },
      { exp: "공과금·디지털구독", num: "10~20% 할인" },
    ],
    benefits: [
      { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
      { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
      { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
      { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
    ],
    image: testThumbnail,
  },
  {
    id: 2,
    name: "신한카드 Shopping Saver",
    state: false,
    tagline: "맛있게 즐길수록 더 알뜰해지는 여행 파트너",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    subBenefits: [
      { exp: "쇼핑·패션", num: "15% 할인" },
      { exp: "온라인 쇼핑", num: "10% 할인" },
      { exp: "생활·주유", num: "5% 할인" },
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
    id: 3,
    name: "신한카드 Travel Plus",
    state: false,
    tagline: "맛있게 즐길수록 더 알뜰해지는 여행 파트너",
    desc: [
      "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’.",
      "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
      "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
    ],
    subBenefits: [
      { exp: "항공·호텔", num: "20% 할인" },
      { exp: "렌터카·여행", num: "15% 할인" },
      { exp: "해외 결제", num: "10% 할인" },
    ],
    benefits: [
      { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
      { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
      { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
      { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
    ],
    image: card2,
  },
];

const CardImgWrap = styled.div`
  position: relative;
  width: 113px;
  height: 180px;
  perspective: 900px;
  transform-style: preserve-3d;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;

  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
  transition: transform 120ms ease, filter 200ms ease, box-shadow 200ms ease;

  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);

  ${CardImgWrap}[data-hovered="true"] & {
    transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0)
      translateY(-2px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);
    filter: brightness(1.02);
  }
`;
function CardPreview({ src }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0~1
    const py = (e.clientY - rect.top) / rect.height; // 0~1

    const max = 10; // 최대 기울기 각도
    const ry = (px - 0.5) * (max * 2); // 좌우 회전
    const rx = -(py - 0.5) * (max * 2); // 상하 회전
    setTilt({ rx, ry });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setHovered(false);
  };

  return (
    <CardImgWrap
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      data-hovered={hovered}
      style={{ "--rx": `${tilt.rx}deg`, "--ry": `${tilt.ry}deg` }}
    >
      <CardImg src={src} alt="" />
    </CardImgWrap>
  );
}

export default function TripCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { state } = useLocation();
  const prevUrl = state?.prevUrl || "/trip";
  const soloTrip = state?.soloTrip || false; // 전달받은 soloTrip 상태
  const navigate = useNavigate();

  const handleDetailClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const location = useLocation();
  const gotoApply = (card) => {
    const prevUrl = location.pathname;
    navigate(`/card/${card.id}/apply`, { state: { card: card, prevUrl } });
    sessionStorage.setItem("triplet:selectedCardId", card.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <>
      {isModalOpen && <ModalForCard card={selectedCard} onClose={closeModal} />}
      <Container>
        <Title>
          <MainTitle>Triplet이 추천하는 카드</MainTitle>
          <SubTitle>
            작성하신 예산을 바탕으로 가장 알맞은 카드를 추천해드려요.
          </SubTitle>
        </Title>
        <div>
          <BackBtn url={prevUrl} text="이전" state={{ soloTrip }} />
          <Fill>
            <Contents>
              <PageTitle>
                <BlueTitle>왜 이 카드일까요?</BlueTitle>
              </PageTitle>
              <div>
                <DetailContainer>
                  <DetailTitle>
                    특정 항목에 치우치지 않고 균형 있게 계획하셨어요.
                  </DetailTitle>
                  <DetailTitle>
                    다양한 혜택을 고르게 제공하는 카드를 준비했습니다.
                  </DetailTitle>
                </DetailContainer>
              </div>
            </Contents>
            <Contents>
              <PageTitle>
                <BlueTitle>여행에 맞는 카드</BlueTitle>
              </PageTitle>
              <div>
                <Detail>
                  {cardList.map((card) => (
                    <React.Fragment key={card.id}>
                      <CardInfo>
                        <CardPreview src={card.image} />
                        <CardExplain>
                          <CardMain>
                            <CardTitle>{card.name}</CardTitle>
                            {card.state && (
                              <CardState>
                                이미 모임에서 사용중인 카드입니다.
                              </CardState>
                            )}
                          </CardMain>
                          <CardBenefits>
                            {card.subBenefits.map((benefit, index) => (
                              <CardBenefit key={index}>
                                <CardBenefitExp>{benefit.exp}</CardBenefitExp>
                                <CardBenefitNum>{benefit.num}</CardBenefitNum>
                              </CardBenefit>
                            ))}
                          </CardBenefits>
                        </CardExplain>
                        <CardDetail>
                          <DetailBtn
                            text="상세보기"
                            getFunction={() => handleDetailClick(card)} // 수정된 부분
                          />
                          <MediumBtn
                            label="발급하기"
                            onClick={() => gotoApply(card)}
                          />
                        </CardDetail>
                      </CardInfo>
                      <Line />
                    </React.Fragment>
                  ))}
                </Detail>
              </div>
            </Contents>
          </Fill>
        </div>
      </Container>
    </>
  );
}

const Line = styled.div`
  width: 880px;
  height: 1px;
  background: ${colors.gray300};
`;

const CardDetail = styled.div`
  display: flex;
  width: 120px;
  height: 180px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  flex-shrink: 0;
`;

const CardExplain = styled.div`
  display: flex;
  width: 500px;
  height: 180px;
  flex-direction: column;
  justify-content: space-between;
`;

const CardMain = styled.div`
  display: flex;
  width: 440px;
  height: 33px;
  gap: 12px;
  flex-direction: row;
  align-items: center;
`;
const CardTitle = styled.div`
  ${fontSet.body1_b}
  width: 440px;
`;
const CardState = styled.div`
  ${fontSet.detail}
  color: ${colors.blue500};
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardBenefits = styled.div`
  display: flex;
  width: 440px;
  height: 96px;
  flex-direction: column;
  gap: 12px;
`;
const CardBenefit = styled.div`
  display: flex;
  width: 440px;
  height: 24px;
  gap: 20px;
  flex-direction: row;
`;
const CardBenefitExp = styled.div`
  ${fontSet.body2_m}
  color: ${colors.gray600};
  width: 160px;
`;
const CardBenefitNum = styled.div`
  ${fontSet.body2_m}
`;

const CardInfo = styled.div`
  width: 840px;
  height: 180px;
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: flex-end;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 48px;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
`;

const DetailTitle = styled.div`
  ${fontSet.body2_m}
  color: ${colors.black};
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlueTitle = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  height: 29px;
`;

const PageTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Fill = styled.div`
  width: 880px;
  margin-left: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
  margin-top: 40px;
  gap: 80px;
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
const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
`;

const MainTitle = styled.div`
  ${fontSet.heading1}
`;

const SubTitle = styled.div`
  ${fontSet.heading2}
`;

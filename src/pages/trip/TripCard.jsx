import React, { useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import DetailBtn from "../../components/button/DetailBtn";
import testThumbnail from "./../../assets/img/test_thumbnail.png";
import MediumBtn from "../../components/button/MediumBtn";
import ModalForCard from "../../components/modal/ModalForCard";
import { useLocation } from "react-router-dom";

export default function TripCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleDetailClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const cardList = [
    {
      id: 1,
      title: "Triplet 식도락 카드",
      state: true,
      subTitle: "맛있게 즐길수록 더 알뜰해지는 여행 파트너",
      describes: [
        { exp: "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’." },
        {
          exp: "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
        },
        {
          exp: "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
        },
      ],
      benefits: [
        { exp: "외식·배달·편의점", num: "10% 할인" },
        { exp: "쇼핑·주유·생활", num: "5~10% 할인" },
        { exp: "공과금·디지털구독", num: "10~20% 할인" },
      ],
      mainBenefits: [
        { exp: "일반 음식점 결제 10% 캐시백 ", num: "(월 최대 30,000원)" },
        {
          exp: "카페·베이커리 5% 적립",
          num: "(스타벅스, 이디야, 파리바게뜨 등 제휴)",
        },
        { exp: "편의점 결제 5% 캐시백", num: "(CU, GS25, 세븐일레븐)" },
        { exp: "해외 음식점 결제 수수료 0% + 3% 추가 적립", num: "" },
      ],
    },
    {
      id: 2,
      title: "신한카드 Shopping Saver",
      state: false,
      subTitle: "맛있게 즐길수록 더 알뜰해지는 여행 파트너",
      describes: [
        { exp: "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’." },
        {
          exp: "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
        },
        {
          exp: "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
        },
      ],
      benefits: [
        { exp: "쇼핑·패션", num: "15% 할인" },
        { exp: "온라인 쇼핑", num: "10% 할인" },
        { exp: "생활·주유", num: "5% 할인" },
      ],
      mainBenefits: [
        { exp: "일반 음식점 결제 10% 캐시백 ", num: "(월 최대 30,000원)" },
        {
          exp: "카페·베이커리 5% 적립",
          num: "(스타벅스, 이디야, 파리바게뜨 등 제휴)",
        },
        { exp: "편의점 결제 5% 캐시백", num: "(CU, GS25, 세븐일레븐)" },
        { exp: "해외 음식점 결제 수수료 0% + 3% 추가 적립", num: "" },
      ],
    },
    {
      id: 3,
      title: "신한카드 Travel Plus",
      state: false,
      subTitle: "맛있게 즐길수록 더 알뜰해지는 여행 파트너",
      describes: [
        { exp: "여행에서 가장 큰 즐거움은 역시 ‘먹는 즐거움’." },
        {
          exp: "Triplet 식도락 카드는 외식과 카페, 편의점 결제에서 특별한 혜택을 제공합니다.",
        },
        {
          exp: "여행 중 예상보다 커지기 쉬운 식비 지출을 스마트하게 관리해보세요.",
        },
      ],
      benefits: [
        { exp: "항공·호텔", num: "20% 할인" },
        { exp: "렌터카·여행", num: "15% 할인" },
        { exp: "해외 결제", num: "10% 할인" },
      ],
      mainBenefits: [
        { exp: "일반 음식점 결제 10% 캐시백 ", num: "(월 최대 30,000원)" },
        {
          exp: "카페·베이커리 5% 적립",
          num: "(스타벅스, 이디야, 파리바게뜨 등 제휴)",
        },
        { exp: "편의점 결제 5% 캐시백", num: "(CU, GS25, 세븐일레븐)" },
        { exp: "해외 음식점 결제 수수료 0% + 3% 추가 적립", num: "" },
      ],
    },
  ];

  const { state } = useLocation();
  const prevUrl = state?.prevUrl || "/trip";
  const soloTrip = state?.soloTrip || false; // 전달받은 soloTrip 상태

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
          <BackBtn url={prevUrl} text="이전" state={{ soloTrip }} />{" "}
          {/* soloTrip 전달 */}
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
                        <CardImg src={testThumbnail} alt="" />
                        <CardExplain>
                          <CardMain>
                            <CardTitle>{card.title}</CardTitle>
                            {card.state && (
                              <CardState>
                                이미 모임에서 사용중인 카드입니다.
                              </CardState>
                            )}
                          </CardMain>
                          <CardBenefits>
                            {card.benefits.map((benefit, index) => (
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
                          <MediumBtn label="발급하기" />
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

const CardImg = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
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

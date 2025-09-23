import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import DetailBtn from "../../components/button/DetailBtn";

import MediumBtn from "../../components/button/MediumBtn";
import ModalForCard from "../../components/modal/ModalForCard";
import { useNavigate, useLocation } from "react-router-dom";
import { api, setAccessToken } from "../../lib/api";
import { getCardCoverById } from "../../assets/cardCoverSquare";
import { loadTripDraft } from "./TripDraftSession";

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

const WHY_BY_THEME = {
  1: [
    "맛집 탐방과 카페 투어가 중심이 되는 일정이에요.",
    "식당·카페·편의점 지출을 든든히 챙겨줄 카드를 우선 추천해 드릴게요.",
  ],
  2: [
    "이동과 레저·체험이 많은 역동적인 일정이에요.",
    "교통·레저·장비 대여 등 액티비티 카테고리에 강한 혜택 카드를 먼저 보여드릴게요.",
  ],
  3: [
    "숙소 중심의 휴식과 스파·온천이 어울리는 느긋한 일정이에요.",
    "숙박·스파·리조트처럼 휴식 지출에 유리한 혜택 카드를 중심으로 골라 드릴게요.",
  ],
  4: [
    "식비·이동·숙박이 고르게 섞인 다채로운 일정이에요.",
    "여러 카테고리에서 폭넓게 혜택을 주는 범용 카드를 우선 추천할게요.",
  ],
};

export default function TripCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { state } = useLocation();
  const [cardList, setCardList] = useState([]);
  const [whyMsgs, setWhyMsgs] = useState(WHY_BY_THEME[4]);
  var prevUrl = state?.prevUrl || "/trip";
  var soloTrip = state?.soloTrip || false; // 전달받은 soloTrip 상태
  const navigate = useNavigate();
  const location = useLocation();

  const migrateThemeNum = (snap) => {
    if (snap && snap.themeNum != null) return snap.themeNum;
  };

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
        const snap = loadTripDraft();
        const themeNum = migrateThemeNum(snap);
        setWhyMsgs(WHY_BY_THEME[themeNum]);

        const res = await api(`/api/card/recommandCard?themeNum=${themeNum}`, {
          method: "GET",
        });

        const list = Array.isArray(res) ? res : res?.data ?? [];

        const toUI = (c) => {
          const descStr = c.cardDesc;
          const desc = Array.isArray(descStr)
            ? descStr
            : String(descStr)
                .split(/\r?\n/) // \n 또는 \r\n 모두 대응
                .map((s) => s.trim()) // 앞뒤 공백 제거
                .filter(Boolean); // 빈 항목 제거

          const subBenefits = (c.benefits || []).map((sb) => ({
            exp: sb.shortTitle,
            num: sb.shortContent,
          }));

          const benefits = (c.benefits || []).map((b) => ({
            title: b.title,
            content: b.content,
          }));

          return {
            id: c.cardId,
            name: c.cardName,
            tagline: c.cardIntro ?? "",
            desc,
            subBenefits,
            benefits,
            image: getCardCoverById(c.cardId),
          };
        };

        const recommCard = list.map(toUI);
        console.log(recommCard.length);
        setCardList(recommCard);
      } catch (e) {
        setCardList([]);
      }
    })();
  }, [navigate, location]);

  const handleDetailClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (location.state?.soloTrip !== undefined) {
      soloTrip = location.state.soloTrip;
    } else {
      soloTrip = false;
    }

    if (location.state?.prevUrl !== undefined) {
      prevUrl = location.state.prevUrl;
    } else {
      prevUrl = "/trip";
    }
  }, [location.state]);

  const gotoApply = (card) => {
    const prev2Url = location.pathname;
    navigate(`/card/${card.id}/apply`, {
      state: { card: card, prev2Url, soloTrip, prevUrl },
    });
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
                  {whyMsgs.map((msg, i) => (
                    <DetailTitle key={i}>{msg}</DetailTitle>
                  ))}
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
                            {/* {card.state && (
                              <CardState>
                                이미 모임에서 사용중인 카드입니다.
                              </CardState>
                            )} */}
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

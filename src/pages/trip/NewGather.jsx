import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import shadows from "../../styles/shadows";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputBox from "../../components/input/InputBox";
import checkIcon from "../../assets/icon/check.svg";
import LargeBtn from "../../components/button/LargeBtn";
import Modal from "../../components/modal/Modal";
import { api, setAccessToken } from "../../lib/api";
import { getCardCoverById } from "../../assets/cardCoverSquare";

export default function NewGather() {
  const [selectedCard, setselectedCard] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardList, setCardList] = useState([]);
  const { state } = useLocation();
  var soloTrip = state?.soloTrip || false;

  const gotoTripCard = () => {
    const prevUrl = location.pathname;
    navigate("/trip/new/card", { state: { prevUrl, soloTrip } });
  };
  const gotoHome = () => {
    navigate("/");
  };
  const gotoMypage = () => {
    navigate("/mypage?tab=gather");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const newGather = () => {
    setIsModalOpen(true);
  };

  const handleSelectCard = (id) => {
    setselectedCard((prev) => (prev === id ? null : id));
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

        const res = await api("/api/gather/myCard", { method: "GET" });
        const myCard = (res?.personalCards ?? []).map((g) => ({
          id: g.mcardId,
          title: g.nickname,
          cardImg: getCardCoverById(g.cardId),
        }));
        setCardList(myCard);
      } catch (e) {
        setCardList(e?.message ?? "불러오기에 실패했어요");
      }
    })();
  }, [navigate, location]);

  return (
    <>
      {isModalOpen && (
        <Modal
          title="새로운 모임을 만들었어요"
          def1="새로운 모임과 함께 플랜대로 가볍게"
          def2="끝나면 레포트로 기록을 깔끔하게 정리해요"
          type={1}
          onClose={closeModal}
          func1={gotoHome}
          func2={gotoMypage}
        />
      )}
      <Container>
        <Title>
          <MainTitle>새로운 모임 만들기</MainTitle>
          <SubTitle>Triplet 사용자만 추가 가능해요.</SubTitle>
          <MiniTitle>초대를 보내면, 친구가 수락 후 함께하게 돼요.</MiniTitle>
          <MiniTitle>멤버 관리는 방장이 언제든 할 수 있어요.</MiniTitle>
        </Title>
        <div>
          <BackBtn
            url="/trip/new/companions"
            text="이전"
            state={{ soloTrip }}
          />
          <Fill>
            <Contents>
              <PageTitle>
                <BlueTitle>모임 정보</BlueTitle>
              </PageTitle>
              <div>
                <Detail>
                  <DetailTitle>모임 이름</DetailTitle>
                  <InputBox
                    placeholder="모임 이름을 작성해주세요"
                    width={700}
                  ></InputBox>
                </Detail>
                <MiniText>
                  <TextContainer>
                    <img src={checkIcon} alt="member" />
                    모임 멤버 초대는 마이페이지 &gt; 내 모임 에서 할 수 있어요
                  </TextContainer>
                  <TextContainer>
                    <img src={checkIcon} alt="member" />
                    모임 멤버 초대는 여행 전날까지만 가능해요
                  </TextContainer>
                </MiniText>
              </div>
            </Contents>
            <Contents>
              <PageTitle>
                <BlueTitle>모임 카드 선택</BlueTitle>
              </PageTitle>
              <GatherList>
                {cardList.map((card) => (
                  <MyCard
                    key={card.id}
                    selected={selectedCard === card.id}
                    onClick={() => handleSelectCard(card.id)}
                  >
                    <GatherTitle>{card.title}</GatherTitle>
                    <GatherCard>
                      <BgImg src={card.cardImg} alt="" />
                    </GatherCard>
                  </MyCard>
                ))}
              </GatherList>
            </Contents>
          </Fill>
        </div>
        <BtnSpace>
          <LargeBtn
            label="지난 카드 그대로"
            bgColor={colors.blue400}
            textColor={colors.white}
            width={240}
            disabled={!selectedCard}
            onClick={newGather}
          ></LargeBtn>
          <LargeBtn
            label="새 카드 만들기"
            bgColor={colors.blue400}
            textColor={colors.white}
            width={240}
            disabled={!!selectedCard}
            onClick={gotoTripCard}
          ></LargeBtn>
        </BtnSpace>
      </Container>
    </>
  );
}

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MiniText = styled.div`
  ${fontSet.detail}
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 12px;
`;

const MyCard = styled.div`
  width: 430px;
  height: 107px;
  background: ${colors.white};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid ${colors.gray400};
  cursor: pointer;
  box-shadow: ${(props) => (props.selected ? shadows.select : "none")};

  &:hover {
    border-color: ${colors.blue500};
  }
`;

const BlueTitle = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  height: 29px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
`;

const DetailTitle = styled.div`
  ${fontSet.body2_m}
  color: ${colors.black};
  width: 160px;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GatherList = styled.div`
  display: grid;
  width: 880px;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
`;

const GatherTitle = styled.div`
  ${fontSet.body2_b}
  width: 240px;
  margin-right: 8px;
  text-align: start;
`;

const GatherCard = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  align-items: center;
`;

const BgImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: rotate(-90deg);
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

const BtnSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  gap: 40px;
`;

const MainTitle = styled.div`
  ${fontSet.heading1}
`;

const SubTitle = styled.div`
  ${fontSet.heading2}
`;

const MiniTitle = styled.div`
  ${fontSet.body1_m}
`;

import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import LargeBtn from "../../components/button/LargeBtn";
import BackBtn from "../../components/button/BackBtn";
import CheckBox from "./components/CheckBox";
import { useState } from "react";
import testThumbnail from "./../../assets/img/test_thumbnail.png";
import memberIcon from "../../assets/icon/gather_black.svg";
import shadows from "../../styles/shadows";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../../components/modal/Modal";

export default function Gather() {
  const [soloTrip, setSoloTrip] = useState(false);
  const [selectedGathering, setSelectedGathering] = useState(null);
  const [selectedCard, setselectedCard] = useState(null);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    if (location.state?.soloTrip !== undefined) {
      setSoloTrip(location.state.soloTrip);
    } else {
      setSoloTrip(false);
    }
  }, [location.state]);

  const gatherings = [
    {
      id: 1,
      title: "안농",
      members: ["한주원", "이연재", "신다운"],
      cardImg: { testThumbnail },
    },
    {
      id: 2,
      title: "신한모임",
      members: ["김철수", "박영희"],
      cardImg: { testThumbnail },
    },
    {
      id: 3,
      title: "고등학교띠예",
      members: ["한주원", "이다함", "최은빈"],
      cardImg: { testThumbnail },
    },
    {
      id: 4,
      title: "먹보들",
      members: ["때지1", "때지2"],
      cardImg: { testThumbnail },
    },
  ];

  const cardList = [
    {
      id: 1,
      title: "Triplet 식도락 카드",
      cardImg: { testThumbnail },
    },
    {
      id: 2,
      title: "Triplet 먹보 카드",
      cardImg: { testThumbnail },
    },
    {
      id: 3,
      title: "Triplet 다우니 카드",
      cardImg: { testThumbnail },
    },
    {
      id: 4,
      title: "Triplet 때지 카드",
      cardImg: { testThumbnail },
    },
  ];

  const handleSelect = (id) => {
    setSelectedGathering((prev) => (prev === id ? null : id));
  };
  const handleSelectCard = (id) => {
    setselectedCard((prev) => (prev === id ? null : id));
  };

  const navigate = useNavigate();
  const gotoNewGather = () => {
    navigate("/newgather");
  };
  const gotoNewCard = () => {
    const prevUrl = location.pathname;
    navigate("/newcard", { state: { prevUrl, soloTrip } });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const newGatherUsingMyCard = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          title="Triplet 카드를 만들었어요"
          def1="혜택은 확실하게, 관리는 단순하게."
          def2="가볍게 사용하고 실속을 꽉 챙기세요!"
          type={3}
          text="시로모 케이블카"
          onClose={closeModal}
        />
      )}
      <Container>
        <Title>
          <MainTitle>동행자 조사</MainTitle>
          <SubTitle>이번 여행, 누구와 함께하시나요?</SubTitle>
          <MiniTitle>지난 모임과 함께라면 기존 카드를 그대로,</MiniTitle>
          <MiniTitle>새로운 모임이라면 새로운 카드를 만들어야 해요.</MiniTitle>
        </Title>

        <div>
          <BackBtn url="/tripcost" text="이전" />
          <Fill>
            <Contents>
              <PageTitle>
                <BlueTitle>모임 체크</BlueTitle>
                <Check>
                  <CheckBox checked={soloTrip} onChange={setSoloTrip} />
                  <CheckText>혼자만의 여행이에요</CheckText>
                </Check>
              </PageTitle>
              <GatherList $soloTrip={soloTrip}>
                {soloTrip
                  ? cardList.map((card) => (
                      <MyCard
                        key={card.id}
                        selected={selectedCard === card.id}
                        onClick={() => handleSelectCard(card.id)}
                      >
                        <GatherTitle>{card.title}</GatherTitle>
                        <GatherCard>
                          <BgImg src={testThumbnail} alt="" />
                        </GatherCard>
                      </MyCard>
                    ))
                  : gatherings.map((gathering) => (
                      <GatheringCard
                        key={gathering.id}
                        selected={selectedGathering === gathering.id}
                        onClick={() => handleSelect(gathering.id)}
                      >
                        <GatherTitle>{gathering.title}</GatherTitle>
                        <GatherMember>
                          <img src={memberIcon} alt="member" />
                          <Member>
                            {gathering.members.map((member, index) => (
                              <span key={index}>
                                {member}
                                {index < gathering.members.length - 1 && ", "}
                              </span>
                            ))}
                          </Member>
                        </GatherMember>
                        <GatherCard>
                          <BgImg src={testThumbnail} alt="" />
                        </GatherCard>
                      </GatheringCard>
                    ))}
              </GatherList>
            </Contents>
          </Fill>
        </div>
        <BtnSpace>
          {soloTrip ? (
            <>
              <LargeBtn
                label="지난 카드 그대로"
                bgColor={colors.blue400}
                textColor={colors.white}
                width={240}
                disabled={!selectedCard}
              ></LargeBtn>
              <LargeBtn
                label="새 카드 만들기"
                bgColor={colors.blue400}
                textColor={colors.white}
                width={240}
                disabled={!!selectedCard}
                onClick={gotoNewCard}
              ></LargeBtn>
            </>
          ) : (
            <>
              <LargeBtn
                label="지난 모임 그대로"
                bgColor={colors.blue400}
                textColor={colors.white}
                width={240}
                disabled={!selectedGathering}
                onClick={newGatherUsingMyCard}
              ></LargeBtn>
              <LargeBtn
                label="새 모임 만들기"
                bgColor={colors.blue400}
                textColor={colors.white}
                width={240}
                disabled={!!selectedGathering}
                onClick={gotoNewGather}
              ></LargeBtn>
            </>
          )}
        </BtnSpace>
      </Container>
    </>
  );
}

const GatheringCard = styled.div`
  width: 880px;
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

const Member = styled.div`
  ${fontSet.body3_m}
  margin-left: 12px;
`;

const GatherMember = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 450px;
  margin-right: 8px;
`;

const GatherList = styled.div`
  display: grid;
  width: 880px;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  grid-template-columns: ${({ $soloTrip }) =>
    $soloTrip ? "repeat(2, 1fr)" : "1fr"};
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

const PageTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const Fill = styled.div`
  width: 880px;
  margin-left: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
  margin-top: 40px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BlueTitle = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  height: 29px;
`;

const Check = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const CheckText = styled.div`
  ${fontSet.body2_m}
  color: ${colors.black};
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

import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import LargeBtn from "../../components/button/LargeBtn";
import BackBtn from "../../components/button/BackBtn";
import CheckBox from "../../components/trip/CheckBox";
import { useState, useEffect } from "react";
import memberIcon from "../../assets/icon/gather_black.svg";
import shadows from "../../styles/shadows";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import { api, ensureAccessToken } from "../../lib/api";
import { getCardCoverById } from "../../assets/cardCoverBasic";

export default function Gather() {
  var [soloTrip, setSoloTrip] = useState(false);
  const [selectedGathering, setSelectedGathering] = useState(null);
  const [selectedCard, setselectedCard] = useState(null);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModal2Open] = useState(false);

  const [gatherings, setGatherings] = useState([]);
  const [soloGathering, setSoloGathering] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        await ensureAccessToken();
        const res = await api("/api/gather/me", { method: "GET" });
        if (!mounted) return;

        const ownerUi = (res?.ownerGathers ?? []).map((g) => ({
          id: g.gatherId,
          title: g.title,
          members: g.members ?? [],
          cardImg: getCardCoverById(g.cardId),
        }));
        const soloUi = (res?.soloGathers ?? []).map((g) => ({
          id: g.gatherId,
          title: g.title,
          members: g.members ?? [],
          cardImg: getCardCoverById(g.cardId),
        }));

        setGatherings(ownerUi);
        setSoloGathering(soloUi);
        setError(null);
      } catch (e) {
        setError(e?.message ?? "불러오기에 실패했어요");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // location을 의존성에 넣고 싶으면 pathname 정도만:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.soloTrip !== undefined) {
      setSoloTrip(location.state.soloTrip);
    } else {
      setSoloTrip(false);
    }
  }, [location.state]);

  const handleSelect = (id) => {
    setSelectedGathering((prev) => (prev === id ? null : id));
  };
  const handleSelectCard = (id) => {
    setselectedCard((prev) => (prev === id ? null : id));
  };

  const navigate = useNavigate();
  const gotoNewGather = () => {
    const prevUrl = location.pathname;
    navigate("/trip/new/gather", { state: { prevUrl, soloTrip } });
  };
  const gotoNewCard = () => {
    const prevUrl = location.pathname;
    navigate("/trip/new/card", { state: { prevUrl, soloTrip } });
  };
  const gotoHome = () => {
    navigate("/");
  };
  const gotoMypage = () => {
    navigate("/mypage?tab=trip");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const gatherUsingMyCard = async () => {
    if (!selectedGathering) return;
    try {
      await ensureAccessToken();
      await api("/api/trips/from-draft", {
        method: "POST",
        body: { gatherId: selectedGathering },
      });
      setIsModalOpen(true);
    } catch (e) {
      alert("여행 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const tripGoingAlone = async () => {
    if (!selectedCard) return;
    try {
      await ensureAccessToken();
      await api("/api/trips/from-draft", {
        method: "POST",
        body: { gatherId: selectedCard },
      });
      setIsModal2Open(true);
    } catch (e) {
      alert("여행 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (location.state?.soloTrip !== undefined) {
      soloTrip = location.state.soloTrip;
    } else {
      soloTrip = false;
    }
  }, [location.state]);

  return (
    <>
      {isModalOpen && (
        <Modal
          title="여행 갈 준비가 완료되었어요"
          def1="여행은 계획대로, 지출은 예산대로"
          def2="끝나면 레포트로 기록을 깔끔하게 정리해요"
          type={1}
          onClose={closeModal}
          func1={gotoHome}
          func2={gotoMypage}
        />
      )}
      {isModalOpen2 && (
        <Modal
          title="혼자만의 여행 준비가 완료되었어요"
          def1="여행은 계획대로, 지출은 예산대로"
          def2="끝나면 레포트로 기록을 깔끔하게 정리해요"
          type={1}
          onClose={closeModal}
          func1={gotoHome}
          func2={gotoMypage}
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
          <BackBtn url="/trip/new/cost" text="이전" />
          <Fill>
            <Contents>
              <PageTitle>
                <BlueTitle>모임 체크</BlueTitle>
                <Check>
                  <CheckBox checked={soloTrip} onChange={setSoloTrip} />
                  <CheckText>혼자만의 여행이에요</CheckText>
                </Check>
              </PageTitle>
              <GatherList>
                {soloTrip ? (
                  <>
                    <SoloGatherList>
                      {soloGathering.map((gathering) => (
                        <GatheringCard
                          key={gathering.id}
                          selected={selectedCard === gathering.id}
                          onClick={() => handleSelectCard(gathering.id)}
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
                            <BgImg src={gathering.cardImg} alt="" />
                          </GatherCard>
                        </GatheringCard>
                      ))}
                    </SoloGatherList>
                  </>
                ) : (
                  <>
                    {gatherings.map((gathering) => (
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
                          <BgImg src={gathering.cardImg} alt="" />
                        </GatherCard>
                      </GatheringCard>
                    ))}
                  </>
                )}
              </GatherList>
            </Contents>
          </Fill>
        </div>
      </Container>
      {soloTrip ? (
        <>
          <BtnSpaceSolo>
            <LargeBtn
              label="지난 모임 그대로"
              bgColor={colors.blue400}
              textColor={colors.white}
              width={240}
              disabled={!selectedCard}
              onClick={tripGoingAlone}
            ></LargeBtn>
            <LargeBtn
              label="새 모임 만들기"
              bgColor={colors.blue400}
              textColor={colors.white}
              width={240}
              disabled={!!selectedCard}
              // onClick={gotoNewCard}
              onClick={gotoNewGather}
            ></LargeBtn>
          </BtnSpaceSolo>
        </>
      ) : (
        <>
          <Describe>기존 모임을 선택할 경우 인원 추가가 불가해요</Describe>
          <BtnSpace>
            <LargeBtn
              label="지난 모임 그대로"
              bgColor={colors.blue400}
              textColor={colors.white}
              width={240}
              disabled={!selectedGathering}
              onClick={gatherUsingMyCard}
            ></LargeBtn>
            <LargeBtn
              label="새 모임 만들기"
              bgColor={colors.blue400}
              textColor={colors.white}
              width={240}
              disabled={!!selectedGathering}
              onClick={gotoNewGather}
            ></LargeBtn>
          </BtnSpace>
        </>
      )}
    </>
  );
}

const SoloCardList = styled.div`
  display: grid;
  width: 880px;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
`;
const SoloGatherList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

const Describe = styled.div`
  ${fontSet.body3_m}
  text-align: center;
  margin-top: 60px;
  color: ${colors.error};
`;

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
  grid-template-columns: 1fr;
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
  margin-top: 40px;
  gap: 40px;
`;

const BtnSpaceSolo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
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

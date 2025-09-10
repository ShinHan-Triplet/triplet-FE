import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import MediumBtn from "../../components/button/MediumBtn";
import CardList from "../../components/mypage/CardList";
import { useParams } from "react-router-dom";

// 여행 mock 데이터
const tripsMock = [
  {
    id: 1,
    title: "신혼여행",
    groupName: "신혼부부",
    members: ["신다운", "남편"],
    dateRange: "2035. 03. 13 ~ 2035. 03. 18",
    status: "여행 전",
    card: {
      name: "HJW BABO 체크",
      number: "1234-56**-****-5678",
      account: "111-234-5678",
      checkGather: true,
    },
    theme: "기타",
    budget: [
      { category: "식비", amount: 200000 },
      { category: "교통비", amount: 200000 },
      { category: "여가비", amount: 200000 },
      { category: "기타", amount: 200000 },
      { category: "숙박비", amount: 200000 },
      { category: "보험비", amount: 200000 },
      { category: "합계", amount: 1200000 },
    ],
  },
  {
    id: 2,
    title: "현실도피여행",
    groupName: "도피단",
    members: ["신다운", "한주원", "오선정", "박지원", "정재웅"],
    dateRange: "2025. 08. 28 ~ 2025. 09. 01",
    status: "여행완료",
    card: {
      name: "MUKJJANG 체크",
      number: "6666-58**-****-7070",
      account: "777-654-9999",
      checkGather: true,
    },
    theme: "힐링",
    budget: [
      { category: "식비", amount: 300000 },
      { category: "교통비", amount: 150000 },
      { category: "여가비", amount: 100000 },
      { category: "기타", amount: 50000 },
      { category: "숙박비", amount: 250000 },
      { category: "보험비", amount: 50000 },
      { category: "합계", amount: 900000 },
    ],
  },
  {
    id: 3,
    title: "즉흥여행",
    members: ["신다운"],
    dateRange: "2025. 08. 13~ 2025. 08. 13",
    status: "여행완료",
    card: {
      name: "UP&DOWN 체크",
      number: "0202-12**-****-9876",
      account: "987-654-3210",
      checkGather: false,
    },
    theme: "힐링",
    budget: [
      { category: "식비", amount: 100000 },
      { category: "교통비", amount: 50000 },
      { category: "여가비", amount: 50000 },
      { category: "기타", amount: 20000 },
      { category: "숙박비", amount: 0 },
      { category: "보험비", amount: 0 },
      { category: "합계", amount: 220000 },
    ],
  },
  {
    id: 4,
    title: "입짧은주원과 식도락",
    groupName: "식도락단",
    members: ["신다운", "한주원"],
    dateRange: "2025. 07. 20 ~ 2025. 07. 21",
    status: "여행완료",
    card: {
      name: "HJW BABO 체크",
      number: "1234-56**-****-5678",
      account: "111-234-5678",
      checkGather: true,
    },
    theme: "식도락",
    budget: [
      { category: "식비", amount: 200000 },
      { category: "교통비", amount: 200000 },
      { category: "여가비", amount: 200000 },
      { category: "기타", amount: 200000 },
      { category: "숙박비", amount: 200000 },
      { category: "보험비", amount: 200000 },
      { category: "합계", amount: 1200000 },
    ],
  },
  {
    id: 5,
    title: "가족이랑 제주도",
    groupName: "가족단",
    members: ["신다운", "엄마", "아빠", "언니"],
    dateRange: "2024. 04. 08 ~ 2024. 04. 11",
    status: "여행완료",
    card: {
      name: "FAMILY 카드",
      number: "5555-11**-****-2222",
      account: "222-333-4444",
      checkGather: true,
    },
    theme: "힐링",
    budget: [
      { category: "식비", amount: 180000 },
      { category: "교통비", amount: 120000 },
      { category: "여가비", amount: 80000 },
      { category: "기타", amount: 40000 },
      { category: "숙박비", amount: 300000 },
      { category: "보험비", amount: 20000 },
      { category: "합계", amount: 742000 },
    ],
  },
  {
    id: 6,
    title: "우정포에버 추억쌓기",
    groupName: "우정단",
    members: ["신다운", "짱친1", "짱친2", "짱친3", "짱친4", "짱친5"],
    dateRange: "2024. 01. 25 ~ 2024. 01. 29",
    status: "여행완료",
    card: {
      name: "FRIEND 카드",
      number: "8888-77**-****-9999",
      account: "555-666-7777",
      checkGather: true,
    },
    theme: "액티비티",
    budget: [
      { category: "식비", amount: 250000 },
      { category: "교통비", amount: 100000 },
      { category: "여가비", amount: 120000 },
      { category: "기타", amount: 60000 },
      { category: "숙박비", amount: 200000 },
      { category: "보험비", amount: 30000 },
      { category: "합계", amount: 760000 },
    ],
  },
];

export default function MyTripDetail() {
  const { id } = useParams();
  const trip = tripsMock.find((t) => String(t.id) === String(id));

  if (!trip) {
    return (
      <Wrapper>
        <TripDetail>
          <BackBtn url="/mypage?tab=trip" text="내 여행기록 목록" />
          <Header>
            <h2>여행 정보를 찾을 수 없습니다.</h2>
          </Header>
        </TripDetail>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <TripDetail>
        <BackBtn url="/mypage?tab=trip" text="내 여행기록 목록" />

        <Header>
          <TripTitle>{trip.title}</TripTitle>
          <Status>{trip.status}</Status>
        </Header>

        <TwoCol>
          <Col>
            <Section>
              <BoxSubtitle>사용카드</BoxSubtitle>
              <CardList
                thumbnail={undefined}
                name={trip.card.name}
                nickname={trip.card.nickname}
                status={undefined}
                maskedNumber={trip.card.number}
                linkedAccount={trip.card.account}
                onDetail={undefined}
                width="450px"
                checkGather={trip.card.checkGather}
              />
            </Section>

            <Section>
              <BoxSubtitle>여행 정보</BoxSubtitle>
              <InfoGrid>
                <InfoRow>
                  <InfoLabel>기간</InfoLabel>
                  <InfoValue>{trip.dateRange}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>테마</InfoLabel>
                  <InfoValue><ThemeChip>{trip.theme}</ThemeChip></InfoValue>
                </InfoRow>
                {trip.groupName && (
                  <InfoRow>
                    <InfoLabel>모임명</InfoLabel>
                    <InfoValue>{trip.groupName}</InfoValue>
                  </InfoRow>
                )}
                <InfoRow>
                  <InfoLabel style={{alignSelf: 'flex-start'}}>멤버</InfoLabel>
                  <Members>
                    {trip.members.map((m, idx) => (
                      <MemberImg key={idx}>{m[0]}</MemberImg>
                    ))}
                  </Members>
                </InfoRow>
              </InfoGrid>
            </Section>
          </Col>

          <Col>
            <Section>
              <BoxSubtitle>여행 예산</BoxSubtitle>
              {trip.budget.map((b) => (
                <BudgetRow key={b.category}>
                  <InfoLabel>{b.category}</InfoLabel>
                  <Bar />
                  <BudgetAmount>{b.amount.toLocaleString()}원</BudgetAmount>
                </BudgetRow>
              ))}
            </Section>
          </Col>
        </TwoCol>

        <BtnRow>
          <MediumBtn
            label="삭제"
            bgColor={colors.gray100}
            textColor={colors.error}
            width={160}
            hoverBgColor={colors.gray200}
            onClick={() => {}}
          />
          <MediumBtn
            label="수정"
            bgColor={colors.blue400}
            textColor={colors.white}
            width={160}
            hoverBgColor={colors.blue500}
            onClick={() => {}}
          />
        </BtnRow>
      </TripDetail>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.gray100};
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
`;

const CardBase = styled.div`
  background: ${colors.white};
  box-sizing: border-box;
  width: 1060px;
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  display: flex;
  flex-direction: column;
`;

const TripDetail = styled(CardBase)`
  padding: 30px 70px;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TwoCol = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`;

const Col = styled.div`
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.section`
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BoxSubtitle = styled.div`
  ${fontSet.body2_b};
  color: ${colors.black};
  margin-bottom: 12px;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const TripTitle = styled.div`
  ${fontSet.heading2};
  color: ${colors.black};
`;

const Status = styled.span`
  ${fontSet.detail};
  background: ${colors.gray100};
  color: ${colors.gray700};
  padding: 8px 16px;
  border-radius: 5px;
`;

const InfoLabel = styled.div`
  ${fontSet.body3_m};
  color: ${colors.black};
  width: 70px;
  padding:0 0 0 20px;
`;

const InfoValue = styled.div`
  ${fontSet.body3_m};
  color: ${colors.black};
  flex: 1;
`;

const ThemeChip = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 5px;
  background: ${colors.blue50};
  color: ${colors.black};
  ${fontSet.body3_m};
`;

const Members = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 70px);
  gap: 10px;
  max-width: 340px;
  align-items: center;
`;

const MemberImg = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${colors.yellow100};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: ${colors.gray800};
`;

const BudgetRow = styled.div`
  display: flex;
  align-items: center;
  width: 450px;
  gap: 10px;
  margin-bottom: 6px;
`;

const Bar = styled.div`
  flex: 1;
  height: 8px;
  background: ${colors.gray100};
  border-radius: 4px;
`;

const BudgetAmount = styled.div`
  width: 80px;
  text-align: right;
  color: ${colors.black};
  ${fontSet.detail};
`;
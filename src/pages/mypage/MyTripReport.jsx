import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import CardList from "../../components/mypage/CardList";
import ProgressBar from "../../components/mypage/ProgressBar";
import FilterDropdown from "../../components/mypage/FilterDropdown";
import Train from "../../assets/img/background/trip_history_bg.png";
import Cloud from "../../assets/img/background/train_cloud.png";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";

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
      { category: "식비", amount: 200000, used: 80000 },
      { category: "교통비", amount: 200000, used: 50000 },
      { category: "여가비", amount: 200000, used: 60000 },
      { category: "기타", amount: 200000, used: 20000 },
      { category: "숙박비", amount: 200000, used: 0 },
      { category: "보험비", amount: 200000, used: 0 },
      { category: "합계", amount: 1200000, used: 210000 },
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
      { category: "식비", amount: 300000, used: 290000 },
      { category: "교통비", amount: 150000, used: 140000 },
      { category: "여가비", amount: 100000, used: 90000 },
      { category: "기타", amount: 50000, used: 30000 },
      { category: "숙박비", amount: 250000, used: 250000 },
      { category: "보험비", amount: 50000, used: 50000 },
      { category: "합계", amount: 900000, used: 850000 },
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
      { category: "식비", amount: 100000, used: 70000 },
      { category: "교통비", amount: 50000, used: 30000 },
      { category: "여가비", amount: 50000, used: 20000 },
      { category: "기타", amount: 20000, used: 5000 },
      { category: "숙박비", amount: 0, used: 0 },
      { category: "보험비", amount: 0, used: 0 },
      { category: "합계", amount: 220000, used: 125000 },
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
      { category: "식비", amount: 200000, used: 180000 },
      { category: "교통비", amount: 200000, used: 120000 },
      { category: "여가비", amount: 200000, used: 100000 },
      { category: "기타", amount: 200000, used: 40000 },
      { category: "숙박비", amount: 200000, used: 200000 },
      { category: "보험비", amount: 200000, used: 20000 },
      { category: "합계", amount: 1200000, used: 660000 },
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
      { category: "식비", amount: 180000, used: 170000 },
      { category: "교통비", amount: 960000, used: 960000 },
      { category: "여가비", amount: 80000, used: 60000 },
      { category: "기타", amount: 40000, used: 15000 },
      { category: "숙박비", amount: 300000, used: 300000 },
      { category: "보험비", amount: 20000, used: 20000 },
      { category: "합계", amount: 1580000, used: 1525000 },
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
      { category: "식비", amount: 250000, used: 230000 },
      { category: "교통비", amount: 100000, used: 90000 },
      { category: "여가비", amount: 120000, used: 110000 },
      { category: "기타", amount: 60000, used: 30000 },
      { category: "숙박비", amount: 200000, used: 190000 },
      { category: "보험비", amount: 30000, used: 30000 },
      { category: "합계", amount: 760000, used: 680000 },
    ],
  },
];

// 구름 좌표
const FIXED_POS = [
  { left: "10%", top: "58%" },
  { left: "20%", top: "52%" },
  { left: "30%", top: "48%" },
  { left: "40%", top: "54%" },
  { left: "50%", top: "50%" },
  { left: "60%", top: "56%" },
  { left: "70%", top: "50%" },
  { left: "80%", top: "44%" },
  { left: "90%", top: "48%" },
];

const CATEGORY_LABEL_4 = { 1: "식비", 2: "교통비", 3: "여가비", 4: "기타" };
const krw = (n = 0) => `${Number(n).toLocaleString()}원`;
const hhmm = (iso) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

const cardUsageMockByTripId = {
  1: [
    { useage_id: 101, category: 2, usage_cost: 18000, cost_date: "2035-03-13T09:10:00", memo: "인천공항버스" },
    { useage_id: 102, category: 1, usage_cost: 28000, cost_date: "2035-03-13T12:40:00", memo: "파스타블" },
    { useage_id: 103, category: 3, usage_cost: 18000, cost_date: "2035-03-13T15:20:00", memo: "오션뷰카페" },
    { useage_id: 104, category: 2, usage_cost: 36000, cost_date: "2035-03-14T10:05:00", memo: "택시" },
    { useage_id: 105, category: 1, usage_cost: 52000, cost_date: "2035-03-14T19:10:00", memo: "아웃백스테이크하우스" },
  ],
  2: [
    { useage_id: 201, category: 4, usage_cost: 12000, cost_date: "2025-08-28T08:28:00", memo: "CU 편의점" },
    { useage_id: 202, category: 2, usage_cost: 3000, cost_date: "2025-08-28T10:30:00", memo: "티머니" },
    { useage_id: 203, category: 1, usage_cost: 26000, cost_date: "2025-08-28T12:46:00", memo: "한쭈떡볶이" },
    { useage_id: 204, category: 4, usage_cost: 12000, cost_date: "2025-08-28T15:11:00", memo: "소품샵" },
    { useage_id: 205, category: 1, usage_cost: 33000, cost_date: "2025-08-29T15:59:00", memo: "말차카페앤디저트" },
    { useage_id: 206, category: 2, usage_cost: 41000, cost_date: "2025-08-29T18:24:00", memo: "카카오택시" },
    { useage_id: 207, category: 3, usage_cost: 22000, cost_date: "2025-08-29T19:42:00", memo: "누아드공방" },
    { useage_id: 208, category: 1, usage_cost: 48000, cost_date: "2025-08-30T21:30:00", memo: "아뜨거솥밥" },
    { useage_id: 209, category: 4, usage_cost: 15000, cost_date: "2025-08-30T23:05:00", memo: "GS25 편의점" },
    { useage_id: 210, category: 2, usage_cost: 30000, cost_date: "2025-08-31T10:30:00", memo: "시로모케이블카" },
    { useage_id: 211, category: 1, usage_cost: 26000, cost_date: "2025-08-31T12:46:00", memo: "뜨끈국밥" },
    { useage_id: 212, category: 3, usage_cost: 3000, cost_date: "2025-08-31T15:11:00", memo: "인형뽑기가챠샵" },
    { useage_id: 213, category: 1, usage_cost: 42000, cost_date: "2025-08-31T15:59:00", memo: "만동제과" },
    { useage_id: 211, category: 2, usage_cost: 32000, cost_date: "2025-09-01T12:46:00", memo: "카카오택시" },
    { useage_id: 212, category: 4, usage_cost: 5000, cost_date: "2025-09-01T15:11:00", memo: "세븐일레븐 편의점" },
    { useage_id: 213, category: 2, usage_cost: 80000, cost_date: "2025-09-01T15:59:00", memo: "고속버스" },
  ],
  3: [
    { useage_id: 301, category: 2, usage_cost: 2500,  cost_date: "2025-08-13T09:00:00", memo: "티머니" },
    { useage_id: 302, category: 1, usage_cost: 8500,  cost_date: "2025-08-13T11:30:00", memo: "김밥천국" },
    { useage_id: 303, category: 3, usage_cost: 16000, cost_date: "2025-08-13T14:10:00", memo: "남산타워전망대" },
    { useage_id: 304, category: 3, usage_cost: 70000,  cost_date: "2025-08-13T17:40:00", memo: "용산아이파크몰" },
  ],
  4: [
    { useage_id: 401, category: 1, usage_cost: 26000, cost_date: "2025-07-20T11:20:00", memo: "포가레" },
    { useage_id: 402, category: 1, usage_cost: 22000, cost_date: "2025-07-20T15:30:00", memo: "네시사분" },
    { useage_id: 403, category: 1, usage_cost: 31000, cost_date: "2025-07-20T18:10:00", memo: "청백" },
    { useage_id: 404, category: 2, usage_cost: 18000, cost_date: "2025-07-20T20:10:00", memo: "카카오택시" },
    { useage_id: 405, category: 1, usage_cost: 26000, cost_date: "2025-07-21T12:40:00", memo: "파이프그라운드" },
    { useage_id: 406, category: 1, usage_cost: 31000, cost_date: "2025-07-21T15:00:00", memo: "해브어트리" },
  ],
  5: [
    { useage_id: 501, category: 2, usage_cost: 480000, cost_date: "2024-04-08T08:00:00", memo: "대한항공" },
    { useage_id: 502, category: 1, usage_cost: 58000,  cost_date: "2024-04-08T12:30:00", memo: "지정식당" },
    { useage_id: 503, category: 1, usage_cost: 24000,  cost_date: "2024-04-08T13:10:00", memo: "스타벅스" },
    { useage_id: 504, category: 2, usage_cost: 30000,  cost_date: "2024-04-09T10:40:00", memo: "주유소" },
    { useage_id: 505, category: 1, usage_cost: 86000,  cost_date: "2024-04-09T12:20:00", memo: "흑돼지다운" },
    { useage_id: 506, category: 1, usage_cost: 92000,  cost_date: "2024-04-09T17:20:00", memo: "아름횟집" },
    { useage_id: 507, category: 3, usage_cost: 10000,  cost_date: "2024-04-10T13:30:00", memo: "해비치호텔 수영장" },
    { useage_id: 507, category: 3, usage_cost: 25000,  cost_date: "2024-04-10T19:30:00", memo: "발마사지" },
    { useage_id: 508, category: 2, usage_cost: 480000, cost_date: "2024-04-11T13:30:00", memo: "대한항공" },
  ],
  6: [
    // 2024-01-25
    { useage_id: 601, category: 2, usage_cost: 45000, cost_date: "2024-01-25T08:10:00", memo: "KTX" },
    { useage_id: 602, category: 1, usage_cost: 40000, cost_date: "2024-01-25T12:10:00", memo: "보승회관" },
    { useage_id: 603, category: 1, usage_cost: 9000,  cost_date: "2024-01-25T15:00:00", memo: "이디야커피" },
    { useage_id: 604, category: 3, usage_cost: 52000, cost_date: "2024-01-25T16:50:00", memo: "레드버튼" },
    { useage_id: 605, category: 1, usage_cost: 37000, cost_date: "2024-01-25T19:20:00", memo: "해물명가" },
    { useage_id: 606, category: 4, usage_cost: 6000,  cost_date: "2024-01-25T22:10:00", memo: "CU 편의점" },

    // 2024-01-26
    { useage_id: 607, category: 2, usage_cost: 6000,  cost_date: "2024-01-26T09:00:00", memo: "티머니" },
    { useage_id: 608, category: 4, usage_cost: 8000,  cost_date: "2024-01-26T11:05:00", memo: "베스트프렌즈기프트샵" },
    { useage_id: 609, category: 1, usage_cost: 18000, cost_date: "2024-01-26T12:40:00", memo: "매운떡볶이" },
    { useage_id: 610, category: 3, usage_cost: 32000, cost_date: "2024-01-26T15:30:00", memo: "전시회" },
    { useage_id: 611, category: 1, usage_cost: 28000, cost_date: "2024-01-26T19:40:00", memo: "짱친횟집" },
    { useage_id: 612, category: 1, usage_cost: 8000,  cost_date: "2024-01-26T21:30:00", memo: "츄베릅츄러스" },

    // 2024-01-27
    { useage_id: 613, category: 1, usage_cost: 32000, cost_date: "2024-01-27T08:30:00", memo: "성심당" },
    { useage_id: 614, category: 4, usage_cost: 5000,  cost_date: "2024-01-27T10:20:00", memo: "케이크보관소" },
    { useage_id: 615, category: 1, usage_cost: 44000, cost_date: "2024-01-27T13:00:00", memo: "육쌈냉면" },
    { useage_id: 616, category: 3, usage_cost: 28000, cost_date: "2024-01-27T16:10:00", memo: "루지체험" },
    { useage_id: 617, category: 1, usage_cost: 26000, cost_date: "2024-01-27T20:10:00", memo: "BHC치킨" },

    // 2024-01-28
    { useage_id: 618, category: 4, usage_cost: 5500,  cost_date: "2024-01-28T08:00:00", memo: "GS25 편의점" },
    { useage_id: 619, category: 2, usage_cost: 18000,  cost_date: "2024-01-28T09:30:00", memo: "택시" },
    { useage_id: 620, category: 1, usage_cost: 54000, cost_date: "2024-01-28T12:10:00", memo: "신선초밥" }, 
    { useage_id: 621, category: 3, usage_cost: 22000,  cost_date: "2024-01-28T14:45:00", memo: "느좋카페" },
    { useage_id: 622, category: 4, usage_cost: 17000, cost_date: "2024-01-28T17:20:00", memo: "큐티소품샵" },
    { useage_id: 623, category: 3, usage_cost: 12000, cost_date: "2024-01-28T19:00:00", memo: "노래방" },
    { useage_id: 624, category: 1, usage_cost: 6000,  cost_date: "2024-01-28T22:15:00", memo: "아이스크림할인점" },

    // 2024-01-29
    { useage_id: 625, category: 1, usage_cost: 25000, cost_date: "2024-01-29T11:10:00", memo: "브런치카페" },
    { useage_id: 626, category: 2, usage_cost: 45000,  cost_date: "2024-01-29T15:30:00", memo: "KTX" },
    ],
};

// "YYYY. MM. DD ~ YYYY. MM. DD" → Date 범위
const parseRange = (s) => {
  const [a, b] = s.split("~").map((v) => v.trim());
  const toDate = (x) => {
    const [y, m, d] = x.replace(/\./g, " ").trim().split(/\s+/).map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };
  const start = toDate(a);
  const end = toDate(b);
  return { start, end };
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
};

const isSameDay = (a, b) => {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
};

export default function MyTripReport() {
  const { id } = useParams();
  const trip = tripsMock.find((t) => String(t.id) === String(id));
  const { start, end } = useMemo(() => parseRange(trip.dateRange), [trip.dateRange]);
  const dayCount = useMemo(() => {
    const ms = (end - start) / 86400000;
    return Math.floor(ms) + 1;
  }, [start, end]);

  const dayOptions = useMemo(
    () => Array.from({ length: dayCount }, (_, i) => `${i + 1}일차`),
    [dayCount]
  );

  const [selectedDay, setSelectedDay] = useState(dayOptions[0] || "1일차");
  const selectedIndex = Math.max(0, (parseInt(selectedDay, 10) || 1) - 1);
  const selectedDate = useMemo(() => addDays(start, selectedIndex), [start, selectedIndex]);

  const usagesAll = cardUsageMockByTripId[trip.id] || [];
  const usagesForDay = useMemo(
    () => usagesAll.filter(u => isSameDay(new Date(u.cost_date), selectedDate)),
    [usagesAll, selectedDate]
  );

  if (!trip) return null;

  const amount =
    trip.budget.find((b) => b.category === "합계")?.amount ?? 0;

  const used =
    trip.budget
      .filter((b) => b.category !== "합계")
      .reduce((sum, b) => sum + (b.used ?? 0), 0);

  return (
    <Wrapper>
      <TripReport>
        <BackBtn url={`/mypage/trip/${id}`} text="내 여행기록" />

        <Header>
          <TripTitle>{trip.title}</TripTitle>
          <Status>{trip.status}</Status>
        </Header>

        <TwoCol>
          <Col>
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
          </Col>

          <Col>
            <BoxSubtitle>여행 정보</BoxSubtitle>
            <InfoGrid>
              <InfoRow>
                <InfoLabel>기간</InfoLabel>
                <InfoValue>{trip.dateRange}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>테마</InfoLabel>
                <InfoValue>
                  <ThemeChip>{trip.theme}</ThemeChip>
                </InfoValue>
              </InfoRow>
              {trip.groupName && (
                <InfoRow>
                  <InfoLabel>모임명</InfoLabel>
                  <InfoValue>{trip.groupName}</InfoValue>
                </InfoRow>
              )}
              <InfoRow>
                <InfoLabel style={{ alignSelf: "flex-start" }}>
                  멤버
                </InfoLabel>
                <Members>
                  {trip.members.map((m, idx) => (
                    <MemberImg key={idx}>{m[0]}</MemberImg>
                  ))}
                </Members>
              </InfoRow>
            </InfoGrid>
          </Col>
        </TwoCol>

        <ProgressBar category={"전체"} used={used} total={amount} />

        <DropdownWrap>
            <BoxSubtitle>일자별 지출 분석</BoxSubtitle>
            <FilterDropdown
                label="1일차"
                value={selectedDay}
                onChange={setSelectedDay}
                options={dayOptions}
            />
        </DropdownWrap>
        
        <TimelineStage>
            <Overlay>
                {usagesForDay
                .slice(0, FIXED_POS.length)
                .map((u, i) => (
                    <Marker key={u.usage_id} style={FIXED_POS[i]}>
                    {hhmm(u.cost_date)}
                    <Tooltip className="tooltip" $cat={u.category}>
                        <strong style={{ display: "block", marginBottom: 4 }}>
                        {u.memo}
                        </strong>
                        <span style={{ opacity: 0.85 }}>
                        {(CATEGORY_LABEL_4[u.category] || "기타")} · {krw(u.usage_cost)}
                        </span>
                    </Tooltip>
                    </Marker>
                ))}
            </Overlay>
        </TimelineStage>

      </TripReport>
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

const TripReport = styled(CardBase)`
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
  gap: 20px;
`;

const DropdownWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 0 0;
`;

const BoxSubtitle = styled.div`
  ${fontSet.body2_b};
  color: ${colors.black};
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
  padding: 0 0 0 20px;
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

const TimelineStage = styled.div`
  position: relative;
  width: 100%;
  height: 613px;
  border-radius: 8px;
  background-image: url(${Train});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Marker = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 80px;
  background: url(${Cloud}) center / contain no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;

  ${fontSet.detail};
  color: ${colors.black};

  pointer-events: auto;
  cursor: pointer;
  z-index: 1;
  filter: drop-shadow(0 6px 12px rgba(255,255,255,0.8));
  transition: transform .15s ease, filter .15s ease;

  &:hover {
    transform: translate(-50%, -50%) translateY(-2px);
    filter: drop-shadow(0 8px 16px rgba(255,255,255,1));
  }

  &:focus-visible {
    outline: 2px solid ${colors.blue200};
    outline-offset: 2px;
  }

  &:hover > .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, calc(-50%));
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, calc(-50%));
  z-index: 10;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${colors.gray900};
  color: ${colors.white};
  ${fontSet.body3_m};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity .15s ease, visibility .15s ease, transform .15s ease;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors.gray900};
  }
`;
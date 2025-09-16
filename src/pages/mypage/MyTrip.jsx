import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import { useNavigate } from "react-router-dom";

import TripList from "../../components/mypage/TripList";
import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";

import trip_cover_test from "../../assets/img/trip/trip_cover_test.png";
// import trip_cover1 from "../../assets/img/trip/trip_cover1.png";
import trip_cover2 from "../../assets/img/trip/trip_cover2.png";
import trip_cover3 from "../../assets/img/trip/trip_cover3.png";
import trip_cover4 from "../../assets/img/trip/trip_cover4.png";
import trip_cover5 from "../../assets/img/trip/trip_cover5.png";
import trip_cover6 from "../../assets/img/trip/trip_cover6.png";

const coverById = {
  // 1: trip_cover1,
  1: trip_cover_test,
  2: trip_cover2,
  3: trip_cover3,
  4: trip_cover4,
  5: trip_cover5,
  6: trip_cover6,
};


export default function MyTrip() {
  const navigate = useNavigate();
    // 더미 데이터 예시 (나중에 API 연결)
  const trips = [
    // {
    //   id: 1,
    //   title: "신혼여행",
    //   members: "신다운, 남편",
    //   dateRange: "2035. 03. 13 ~ 2035. 03. 18",
    // },
    {
      id: 1,
      title: "힐링을 주세요",
      members: "신다운",
      dateRange: "2025. 09. 16 ~ 2035. 09. 17",
    },
    {
      id: 2,
      title: "현실도피여행",
      members: "신다운, 한주원, 오선정, 박지원, 정재웅",
      dateRange: "2025. 08. 28 ~ 2025. 09. 01",
    },
    {
      id: 3,
      title: "즉흥여행",
      members: "신다운",
      dateRange: "2025. 08. 13~ 2025. 08. 13",
    },
    {
      id: 4,
      title: "입짧은주원과 식도락",
      members: "신다운, 한주원",
      dateRange: "2025. 07. 20 ~ 2025. 07. 21",
    },
    {
      id: 5,
      title: "가족이랑 제주도",
      members: "신다운, 엄마, 아빠, 언니",
      dateRange: "2024. 04. 08 ~ 2024. 04. 11",
    },
    {
      id: 6,
      title: "우정포에버 추억쌓기",
      members: "신다운, 짱친1, 짱친2, 짱친3, 짱친4, 짱친5",
      dateRange: "2024. 01. 25 ~ 2024. 01. 29",
    },
  ];

  const isEmpty = trips.length === 0;

  return (
    <Wrapper isEmpty={isEmpty}>
      {isEmpty ? (
        <Empty
          title="아직 여행이 없어요."
          desc="Triplet에서 새로운 여행을 계획해보세요."
          action={
            <MediumBtn
              label="계획 세우기"
              onClick={() => navigate('/trip/create')}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={180}
            />
          }
        />
      ) : (
        <Grid>
          {trips.map((trip) => (
            <TripList
              key={trip.id}
              thumbnail={coverById[trip.id]}
              title={trip.title}
              members={trip.members}
              dateRange={trip.dateRange}
              onDetail={() => navigate(`/mypage/trip/${trip.id}`)}
            />
          ))}
        </Grid>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  min-height: 420px;
  padding: 30px 70px;

  display: grid;
  grid-auto-rows: min-content;
  row-gap: 20px;  

  ${({ isEmpty }) =>
    isEmpty &&
    `
    place-content: center;
    place-items: center;
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
`
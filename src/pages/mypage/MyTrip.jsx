import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";

import TripList from "../../components/mypage/TripList";

export default function MyTrip() {
    // 더미 데이터 예시 (나중에 API 연결)
  const trips = [
    {
      id: 1,
      thumbnail: "https://via.placeholder.com/600x400?text=Trip+1",
      title: "신혼여행",
      members: "신다운, 남편",
      dateRange: "2035. 03. 13 ~ 2035. 03. 18",
    },
    {
      id: 2,
      thumbnail: "https://via.placeholder.com/600x400?text=Trip+1",
      title: "현실도피여행",
      members: "신다운, 한주원, 루이지, 시로모, 아무개",
      dateRange: "2025. 08. 28 ~ 2025. 09. 01",
    },
    {
      id: 3,
      thumbnail: "https://via.placeholder.com/600x400?text=Trip+1",
      title: "즉흥여행",
      members: "신다운, 한주원, 오선정, 박지원, 정재웅",
      dateRange: "2025. 08. 13~ 2025. 08. 13",
    },
    {
      id: 4,
      thumbnail: "https://via.placeholder.com/600x400?text=Trip+1",
      title: "입짧은주원과 식도락",
      members: "신다운, 한주원",
      dateRange: "2025. 07. 20 ~ 2025. 07. 21",
    },
    {
      id: 4,
      thumbnail: "https://via.placeholder.com/600x400?text=Trip+1",
      title: "가족이랑 제주도",
      members: "신다운, 엄마, 아빠, 언니",
      dateRange: "2024. 04. 08 ~ 2024. 04. 11",
    },
    {
      id: 4,
      thumbnail: "https://via.placeholder.com/600x400?text=Trip+1",
      title: "우정포에버 추억쌓기",
      members: "신다운, 짱친1, 짱친2, 짱친3, 짱친4, 짱친5",
      dateRange: "2024. 01. 25 ~ 2024. 01. 29",
    },

  ];

  return (
    <Wrapper>
        <Grid>
            {trips.map((t) => (
                <TripList
                key={t.id}
                thumbnail={t.thumbnail}
                title={t.title}
                members={t.members}
                dateRange={t.dateRange}
                onDetail={() => console.log("상세보기:", t.id)}
                />
            ))}
        </Grid>
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
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
`
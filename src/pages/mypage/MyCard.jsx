import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import { useNavigate } from "react-router-dom";

import CardList from "../../components/mypage/CardList";
import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";

export default function MyCard() {
    const navigate = useNavigate();
    // 추후에 데이터 받아오도록 수정
    const thumbnailUrl =
    "https://via.placeholder.com/110x110.png?text=Card";

    const cards = [
    {
      id: 1,
      thumbnail: thumbnailUrl,
      name: "WITH HJW 체크",
      nickname: "한쭈카드",
      status: "active",
      maskedNumber: "1234-56**-****-5678",
      linkedAccount: "111-234-5678",
      checkGather: true,
    },
    {
      id: 2,
      thumbnail: thumbnailUrl,
      name: "MUKJJANG 체크",
      nickname: "쩝쩝박사",
      status: "waiting",
      maskedNumber: "6666-58**-****-7070",
      linkedAccount: "777-654-9999",
      checkGather: true,
    },
    {
      id: 3,
      thumbnail: thumbnailUrl,
      name: "UP&DOWN 체크",
      nickname: "다운카드",
      status: "paused",
      maskedNumber: "0202-12**-****-9876",
      linkedAccount: "987-654-3210",
      checkGather: false,
    },
  ];

  const isEmpty = cards.length === 0;

  return (
    <Wrapper isEmpty={isEmpty}>
      {isEmpty ? (
        <Empty
          title="아직 카드가 없어요."
          desc="Triplet과 함께 할 첫 카드를 만들어 보세요."
          action={
            <MediumBtn
              label="카드 발급하기"
              onClick={() => navigate('/card/create')}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={180}
            />
          }
        />
      ) : (
        cards.map((card) => (
          <CardList
            key={card.id}
            thumbnail={card.thumbnail}
            name={card.name}
            nickname={card.nickname}
            status={card.status}
            maskedNumber={card.maskedNumber}
            linkedAccount={card.linkedAccount}
            onDetail={() => navigate(`/mypage/card/${card.id}`)}
            checkGather={card.checkGather}
          />
        ))
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

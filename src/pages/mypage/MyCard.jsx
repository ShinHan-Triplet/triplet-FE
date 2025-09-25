import { useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import { useNavigate } from "react-router-dom";

import CardList from "../../components/mypage/CardList";
import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";
import { api } from "../../lib/api";

import healing1 from "../../assets/img/card/square/healing1.png";
import healing2 from "../../assets/img/card/square/healing2.png";
import healing3 from "../../assets/img/card/square/healing3.png";
import food1 from "../../assets/img/card/square/food1.png";
import food2 from "../../assets/img/card/square/food2.png";
import food3 from "../../assets/img/card/square/food3.png";
import activity1 from "../../assets/img/card/square/activity1.png";
import activity2 from "../../assets/img/card/square/activity2.png";
import activity3 from "../../assets/img/card/square/activity3.png";
import etc1 from "../../assets/img/card/square/etc1.png";
import etc2 from "../../assets/img/card/square/etc2.png";
import etc3 from "../../assets/img/card/square/etc3.png";

const CARD_COVERS = [
  activity1,
  activity2,
  activity3,
  food1,
  food2,
  food3,
  etc1,
  etc2,
  etc3,
  healing1,
  healing2,
  healing3,
];

function getCardImage(cardId) {
  const idx = Number(cardId) - 1;
  return CARD_COVERS[idx] ?? healing3;
}

export default function MyCard() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api("/api/mycard");

        console.log(data);

        if (!mounted) return;

        const normalized = (Array.isArray(data) ? data : []).map((c) => {
          const raw = c.status ?? c.cardStatus ?? c.status_code ?? 1;
          const code = Number.parseInt(String(raw), 10);
          return { ...c, status: [1, 2, 3].includes(code) ? code : 1 };
        });

        setCards(normalized);
        setErr("");
      } catch (e) {
        console.error(
          "GET /api/mycard failed:",
          e?.status,
          e?.body || e?.message
        );
        if (mounted) setErr("내 카드 목록을 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Wrapper>
        <div>내 카드를 불러오는 중...</div>
      </Wrapper>
    );
  }

  if (err) {
    return (
      <Wrapper>
        <div style={{ color: colors.error }}>{err}</div>
      </Wrapper>
    );
  }

  const isEmpty = cards.length === 0;

  return (
    <Wrapper $isEmpty={isEmpty}>
      {isEmpty ? (
        <Empty
          title="아직 카드가 없어요."
          desc="Triplet과 함께 할 첫 카드를 만들어 보세요."
          action={
            <MediumBtn
              label="카드 발급하기"
              onClick={() => navigate("/card")}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={180}
            />
          }
        />
      ) : (
        cards.map((card) => (
          <CardList
            key={card.cardId}
            thumbnail={getCardImage(card.cardId)}
            name={card.cardName}
            nickname={card.cardNickname}
            status={card.cardStatus}
            maskedNumber={card.cardNum}
            linkedAccount={card.account}
            onDetail={() => navigate(`/mypage/card/${card.mcardId}`)}
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

  ${({ $isEmpty }) =>
    $isEmpty &&
    `
    place-content: center;
    place-items: center;
  `}
`;

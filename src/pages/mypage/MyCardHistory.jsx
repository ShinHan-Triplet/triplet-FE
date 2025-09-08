import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";

import BackBtn from "../../components/button/BackBtn";
import { useParams } from "react-router-dom";

export default function MyCardHistory() {
  const { id } = useParams();

  return (
    <Wrapper>
      <HistoryDetail>
        <BackBtn url={`/mypage/card/${id}`} text="내 카드" />
        레이아웃
      </HistoryDetail>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1060px;
  min-height: 420px;
  margin: 0 auto;
  padding: 30px 70px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardBase = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
`;

const HistoryDetail = styled(CardBase)`
  padding: 30px 70px;
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

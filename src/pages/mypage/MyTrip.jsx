import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";

export default function MyTrip() {
  return (
    <Wrapper>
        내 여행기록
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  min-height: 420px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center; 
`;

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";

import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";

export default function Mygather() {
  const navigate = useNavigate();

  const handleCreatePlan = () => {
    navigate("/trip");
  };

  return (
    <Wrapper>
      내 모임

        {/* 추후 비었을 때 처리 추가 */}
        {/* <Empty
        title="아직 모임이 없어요."
        desc="여행 계획을 세우면 모임을 만들 수 있어요."
        action={
            <MediumBtn
                label="계획 세우기"
                onClick={handleCreatePlan}
                bgColor={colors.blue400}
                textColor={colors.white}
                width={180}
            />
            }
        /> */}
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
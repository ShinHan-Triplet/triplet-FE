import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
//import logo from "../../assets/logo/logo2.png";

//import Empty from "./MyEmpty";

export default function Mygather() {
    // const handleCreatePlan = () => {
    // console.log("계획 세우기 클릭 테스트");
    // };

  return (
    <Wrapper>
      내 모임

    {/* 추후 비었을 때 처리 추가 */}
    {/* <Empty
      icon={<img src={logo} alt="Triplet" />}
      title="아직 모임이 없어요."
      desc="여행 계획을 세우면 모임을 만들 수 있어요."
      action={
        <button onClick={handleCreatePlan}>계획 세우기</button>
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
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center; 
`;

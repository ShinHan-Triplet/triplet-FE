import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import InputBox from "../../components/input/InputBox";
import LargeBtn from "../../components/button/LargeBtn";
import CategoryChip from "../../components/chip/CategoryChip";
import DayCost from "./components/DayCost";
import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function TripCost() {
  const { state } = useLocation();
  console.log(state);
  const [dayTotals, setDayTotals] = useState({});
  const navigate = useNavigate();

  const nextPage = () => {
    navigate("/gather");
  };

  //자식이 total값을 알려줄 때 호출
  const handleTotalChange = (dayIndex) => (total) => {
    setDayTotals((prev) => ({ ...prev, [dayIndex]: Number(total) || 0 }));
  };

  const toStartOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  // 새로고침 등으로 직접 진입했을 때 state가 없을 수도 있으니 방어
  const start = state?.startMs ? new Date(state.startMs) : null;
  const end = state?.endMs ? new Date(state.endMs) : null;
  const days =
    state?.days ??
    (start && end
      ? Math.round((toStartOfDay(end) - toStartOfDay(start)) / 86400000) + 1
      : 0);

  // 유틸: 문자열에서 숫자만 추출
  const toDigits = (s) => String(s ?? "").replace(/\D/g, "");
  // 유틸: 입력창 표시용 포맷 (빈 문자열이면 그대로 빈칸 유지)
  const formatDigits = (digits) =>
    digits === "" ? "" : new Intl.NumberFormat("ko-KR").format(Number(digits));
  const [amounts, setAmounts] = useState({
    stay: "",
    insurance: "",
  });

  const handleAmount = (key) => (e) => {
    const input = e.target.value;
    const digits = toDigits(input);
    if (digits === "" && input !== "") return;
    setAmounts((prev) => ({ ...prev, [key]: digits }));
  };

  const stayPlusInsurance = useMemo(() => {
    const n = (v) => (v === "" ? 0 : Number(v));
    return n(amounts.stay) + n(amounts.insurance);
  }, [amounts]);

  const totalSum = useMemo(() => {
    const daySum = Object.values(dayTotals).reduce(
      (sum, v) => sum + (Number(v) || 0),
      0
    );
    return daySum + stayPlusInsurance;
  }, [dayTotals, stayPlusInsurance]);

  return (
    <Container>
      <Title>
        <MainTitle>여행 예산 계획</MainTitle>
        <SubTitle>앞으로 쓸 금액을 미리 정해두세요</SubTitle>
        <MiniTitle>
          세부적인 일정과 예산을 입력하면, 여행이 더 똑똑해집니다.
        </MiniTitle>
      </Title>

      <div>
        <BackBtn url="" text="이전" />
        <Fill>
          <Contents>
            <AllCost>
              <BlueTitleAll>전체 예산</BlueTitleAll>
              <Tags>
                <Tag>
                  <CategoryChip type="stay"></CategoryChip>
                  <Money>
                    <InputBox
                      placeholder="0"
                      width={256}
                      value={formatDigits(amounts.stay)}
                      onChange={handleAmount("stay")}
                      style={{ textAlign: "right" }}
                    ></InputBox>
                    <Won style={{ textAlign: "right" }}>원</Won>
                  </Money>
                </Tag>
                <Tag>
                  <CategoryChip type="insurance"></CategoryChip>
                  <Money>
                    <InputBox
                      placeholder="0"
                      width={256}
                      value={formatDigits(amounts.insurance)}
                      onChange={handleAmount("insurance")}
                      style={{ textAlign: "right" }}
                    ></InputBox>
                    <Won style={{ textAlign: "right" }}>원</Won>
                  </Money>
                </Tag>
              </Tags>
              <BasisCost>
                <CostText>
                  기본 예산: {formatDigits(stayPlusInsurance)}원
                </CostText>
              </BasisCost>
            </AllCost>
            {Array.from({ length: Math.max(0, days) }, (_, i) => (
              <DayCost
                key={i}
                day={i + 1}
                onTotalChange={handleTotalChange(i + 1)}
              />
            ))}
            <TotalCost>총 예산: {totalSum.toLocaleString()}원</TotalCost>
          </Contents>
        </Fill>
      </div>
      <BtnSpace>
        <LargeBtn
          label="다음"
          onClick={nextPage}
          bgColor={colors.blue400}
          textColor={colors.white}
          width={180}
        ></LargeBtn>
      </BtnSpace>
    </Container>
  );
}

const TotalCost = styled.div`
  ${fontSet.body1_b}
  width:100%;
  display: flex;
  justify-content: center;
`;

const BasisCost = styled.div`
  ${fontSet.body1_b}
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
`;

const CostText = styled.div`
  ${fontSet.body2_m}
`;

const Won = styled.div`
  ${fontSet.body2_m}
  width: 30px;
`;

const Money = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 1060px;
  flex-direction: column;
  align-items: flex-start;
  gap: 80px;
  background: transparent;
  margin-top: 100px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const Fill = styled.div`
  width: 880px;
  margin-left: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
  margin-top: 40px;
`;

const BlueTitleAll = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  margin-bottom: 24px;
  height: 29px;
`;

const BtnSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const AllCost = styled.div`
  gap: 20px;
`;

const Tags = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Tag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const MainTitle = styled.div`
  ${fontSet.heading1}
`;

const SubTitle = styled.div`
  ${fontSet.heading2}
`;

const MiniTitle = styled.div`
  ${fontSet.body1_m}
`;

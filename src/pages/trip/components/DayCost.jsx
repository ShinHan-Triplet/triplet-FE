import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import colors from "../../../styles/colors";
import fontSet from "../../../styles/fonts";
import CheckBox from "./CheckBox";
import InputBox from "../../../components/input/InputBox";
import CategoryChip from "../../../components/chip/CategoryChip";

export default function DayCost({ day, onTotalChange }) {
  const [noSchedule, setNoSchedule] = useState(false);

  const [amounts, setAmounts] = useState({
    food: "",
    transport: "",
    leisure: "",
    etc: "",
  });

  // 유틸: 문자열에서 숫자만 추출
  const toDigits = (s) => String(s ?? "").replace(/\D/g, "");
  // 유틸: 입력창 표시용 포맷 (빈 문자열이면 그대로 빈칸 유지)
  const formatDigits = (digits) =>
    digits === "" ? "" : new Intl.NumberFormat("ko-KR").format(Number(digits));
  const formatWon = (n) => new Intl.NumberFormat("ko-KR").format(n);

  // 체크되면 입력값 리셋
  useEffect(() => {
    if (noSchedule) {
      setAmounts({ food: "", transport: "", leisure: "", etc: "" });
    }
  }, [noSchedule]);

  const handleAmount = (key) => (e) => {
    const input = e.target.value;
    const digits = toDigits(input);
    if (digits === "" && input !== "") return;
    setAmounts((prev) => ({ ...prev, [key]: digits }));
  };

  const total = useMemo(() => {
    const n = (v) => (v === "" ? 0 : Number(v));
    return (
      n(amounts.food) +
      n(amounts.transport) +
      n(amounts.leisure) +
      n(amounts.etc)
    );
  }, [amounts]);

  useEffect(() => {
    if (typeof onTotalChange === "function") onTotalChange(total);
  }, [total]);

  return (
    <Cost>
      <DayTitle>
        <BlueTitle>{day}일차</BlueTitle>
        <Check>
          <CheckBox checked={noSchedule} onChange={setNoSchedule} />
          <CheckText>일정이 없는 날이에요</CheckText>
        </Check>
      </DayTitle>
      {noSchedule ? (
        <Blank>이 날은 일정이 없어요</Blank>
      ) : (
        <div>
          <Tags>
            <Tag>
              <CategoryChip type="food"></CategoryChip>
              <Money>
                <InputBox
                  placeholder="0"
                  width={256}
                  value={formatDigits(amounts.food)}
                  onChange={handleAmount("food")}
                  style={{ textAlign: "right" }}
                ></InputBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
            <Tag>
              <CategoryChip type="transport"></CategoryChip>
              <Money>
                <InputBox
                  placeholder="0"
                  width={256}
                  value={formatDigits(amounts.transport)}
                  onChange={handleAmount("transport")}
                  style={{ textAlign: "right" }}
                ></InputBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
            <Tag>
              <CategoryChip type="leisure"></CategoryChip>
              <Money>
                <InputBox
                  placeholder="0"
                  width={256}
                  value={formatDigits(amounts.leisure)}
                  onChange={handleAmount("leisure")}
                  style={{ textAlign: "right" }}
                ></InputBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
            <Tag>
              <CategoryChip type="etc"></CategoryChip>
              <Money>
                <InputBox
                  placeholder="0"
                  width={256}
                  value={formatDigits(amounts.etc)}
                  onChange={handleAmount("etc")}
                  style={{ textAlign: "right" }}
                ></InputBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
          </Tags>
          <TotalCost>
            <CostText>
              {day}일차 예산: {formatWon(total)}원
            </CostText>
          </TotalCost>
        </div>
      )}
    </Cost>
  );
}

const TotalCost = styled.div`
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

const Blank = styled.div`
  ${fontSet.body2_m}
  color: ${colors.gray500};
  border: 2px dashed ${colors.gray300};
  border-radius: 10px;
  padding: 16px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlueTitle = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  height: 29px;
`;

const Check = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const CheckText = styled.div`
  ${fontSet.body2_m}
  color: ${colors.black};
`;

const Cost = styled.div`
  gap: 20px;
`;

const DayTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  height: 29px;
  margin-bottom: 24px;
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

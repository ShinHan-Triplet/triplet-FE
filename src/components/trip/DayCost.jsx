import styled from "styled-components";
import { useState, useEffect, useMemo, useRef } from "react";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import CheckBox from "./CheckBox";
import InputBox from "../input/InputBox";
import CategoryChip from "../chip/CategoryChip";

export default function DayCost({
  day,
  onTotalChange,
  snapshot,
  onSnapshotChange,
}) {
  const [noSchedule, setNoSchedule] = useState(false);

  const [amounts, setAmounts] = useState({
    food: "",
    transport: "",
    leisure: "",
    etc: "",
  });

  const onSnapshotChangeRef = useRef(onSnapshotChange);
  useEffect(() => {
    onSnapshotChangeRef.current = onSnapshotChange;
  }, [onSnapshotChange]);

  const hydratingFromSnapshotRef = useRef(false);

  useEffect(() => {
    if (!snapshot) return;
    const nextNo = !!snapshot.noSchedule;
    const nextAmts = {
      food: String(snapshot.amounts?.food ?? ""),
      transport: String(snapshot.amounts?.transport ?? ""),
      leisure: String(snapshot.amounts?.leisure ?? ""),
      etc: String(snapshot.amounts?.etc ?? ""),
    };
    const sameNo = noSchedule === nextNo;
    const sameAmts =
      amounts.food === nextAmts.food &&
      amounts.transport === nextAmts.transport &&
      amounts.leisure === nextAmts.leisure &&
      amounts.etc === nextAmts.etc;
    if (!sameNo || !sameAmts) {
      hydratingFromSnapshotRef.current = true; // 바로 위로 올리지 않게 가드
      setNoSchedule(nextNo);
      setAmounts(nextAmts);
    }
  }, [snapshot]);

  const toDigits = (s) => String(s ?? "").replace(/\D/g, "");
  const formatDigits = (digits) =>
    digits === "" ? "" : new Intl.NumberFormat("ko-KR").format(Number(digits));
  const formatWon = (n) => new Intl.NumberFormat("ko-KR").format(n);

  // 체크되면 입력값 리셋
  useEffect(() => {
    if (!noSchedule) return;
    setAmounts((prev) => {
      const allZero =
        prev.food === "0" &&
        prev.transport === "0" &&
        prev.leisure === "0" &&
        prev.etc === "0";
      if (allZero) return prev;
      return { food: "0", transport: "0", leisure: "0", etc: "0" };
    });
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

  useEffect(() => {
    if (hydratingFromSnapshotRef.current) {
      hydratingFromSnapshotRef.current = false;
      return;
    }
    if (
      noSchedule &&
      !(
        amounts.food === "0" &&
        amounts.transport === "0" &&
        amounts.leisure === "0" &&
        amounts.etc === "0"
      )
    ) {
      return;
    }
    onSnapshotChangeRef.current?.({ noSchedule, amounts });
  }, [noSchedule, amounts]);

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

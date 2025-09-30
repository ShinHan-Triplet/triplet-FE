import styled from "styled-components";
import colors from "../../../styles/colors";
import fontSet from "../../../styles/fonts";
import CheckBox from "../CheckBox";
import CategoryChip from "../../chip/CategoryChip";

export default function DayCost({
  day,
  food = 0,
  transport = 0,
  leisure = 0,
  etc = 0,
  noSchedule = false,
}) {
  const formatWon = (n) => new Intl.NumberFormat("ko-KR").format(n);

  return (
    <Cost>
      <DayTitle>
        <BlueTitle>{day}일차</BlueTitle>
        <Check>
          <NoCursorWrap>
            <CheckBox checked={noSchedule} />
          </NoCursorWrap>
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
                <CostBox>{formatWon(food)}</CostBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
            <Tag>
              <CategoryChip type="transport"></CategoryChip>
              <Money>
                <CostBox>{formatWon(transport)}</CostBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
            <Tag>
              <CategoryChip type="leisure"></CategoryChip>
              <Money>
                <CostBox>{formatWon(leisure)}</CostBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
            <Tag>
              <CategoryChip type="etc"></CategoryChip>
              <Money>
                <CostBox>{formatWon(etc)}</CostBox>
                <Won style={{ textAlign: "right" }}>원</Won>
              </Money>
            </Tag>
          </Tags>
          <TotalCost>
            <CostText>
              {day}일차 예산: {formatWon(food + transport + leisure + etc)}원
            </CostText>
          </TotalCost>
        </div>
      )}
    </Cost>
  );
}

const NoCursorWrap = styled.div`
  & *,
  & *:hover,
  & *:active {
    cursor: default !important;
  }
`;

const CostBox = styled.div`
  ${fontSet.body3_m}
  width: 190px;
  height: 19px;
  border: 1px solid ${colors.gray400};
  padding: 16px 32px;
  align-items: center;
  text-align: right;
  border-radius: 10px;
`;

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
  height: 134px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 844px;
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

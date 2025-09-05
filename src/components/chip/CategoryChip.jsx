import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";

const LABEL_BY_TYPE = {
  stay: "숙박비",
  insurance: "보험비",
  food: "식비",
  transport: "교통비",
  leisure: "여가비",
  etc: "기타",
};

const BG_BY_TYPE = {
  stay: colors.blue50,
  insurance: colors.blue50,
  food: colors.green50,
  transport: colors.yellow50,
  leisure: colors.pruple50,
  etc: colors.pink50,
};

const TEXT_BY_TYPE = {
  stay: colors.blue500,
  insurance: colors.blue500,
  food: colors.green300,
  transport: colors.yellow500,
  leisure: colors.pruple300,
  etc: colors.pink300,
};

export default function CategoryChip({ type = "stay" }) {
  const label = LABEL_BY_TYPE[type];
  const bg = BG_BY_TYPE[type];
  const text = TEXT_BY_TYPE[type];

  return (
    <ChipWrap $bg={bg}>
      <ChipText $color={text}>{label}</ChipText>
    </ChipWrap>
  );
}

const ChipWrap = styled.div`
  width: 120px;
  height: 40px;
  background: ${({ $bg }) => $bg};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChipText = styled.div`
  ${fontSet.body2_m};
  color: ${({ $color }) => $color};
`;

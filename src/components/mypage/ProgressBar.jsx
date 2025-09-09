import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";

const categoryPalette = {
  전체:   { bg50: colors.blue50,   bar100: colors.blue100,   bar300: colors.blue300 },
  식비:   { bg50: colors.green50,  bar100: colors.green100,  bar300: colors.green300 },
  교통비: { bg50: colors.yellow50, bar100: colors.yellow100, bar300: colors.yellow300 },
  여가비: { bg50: colors.purple50, bar100: colors.purple100, bar300: colors.purple300 },
  기타:   { bg50: colors.pink50,   bar100: colors.pink100,   bar300: colors.pink300 },
};

const clamp = (n, min=0, max=100) => Math.min(max, Math.max(min, n));
const formatKRW = (n=0) => `${n.toLocaleString()}원`;

export default function ProgressBar({
  category = "전체",
  used = 0,
  total = 0,
}) {
  const pal = categoryPalette[category] ?? categoryPalette["전체"];
  const percent = total > 0 ? clamp((used / total) * 100) : 0;
  const displayTitle = (category === "전체" ? "예산 사용 현황" : `${category} 사용 현황`);
  const isOver = used > total;
  const barColor = isOver ? pal.bar300 : pal.bar100;

  return (
    <Card $bg={pal.bg50} role="group" aria-label={`${category}`}>
      <Header>
        <Title>{displayTitle}</Title>
        <Used $danger={isOver}>{formatKRW(used)}</Used>
      </Header>

      <Track
        role="progressbar"
        aria-label="예산 진행률"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={used}
        $barColor={barColor}
      >
        <Fill style={{ width: `${percent}%` }} />
      </Track>

      <Footer>
        <Min>0원</Min>
        <Max>{formatKRW(total)}</Max>
      </Footer>
    </Card>
  );
}

const Card = styled.div`
  border-radius: 12px;
  padding: 16px 18px 14px;
  background: ${({ $bg }) => $bg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const Title = styled.div`
  ${fontSet.body2_b};
  color: ${colors.gray900};
`;
const Used = styled.div`
  ${fontSet.body2_b};
  color: ${({ $danger }) => ($danger ? colors.error : colors.black)};
`;

const Track = styled.div`
  height: 12px;
  border-radius: 999px;
  background: ${colors.white};
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;

  & > div {
    background: ${({ $barColor }) => $barColor};
  }
`;
const Fill = styled.div`
  height: 100%;
  border-radius: 999px;
  transition: width .25s ease;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Min = styled.span`
  ${fontSet.body3_m};
  color: ${colors.gray600};
`;
const Max = styled.span`
  ${fontSet.body3_m};
  color: ${colors.gray600};
`;

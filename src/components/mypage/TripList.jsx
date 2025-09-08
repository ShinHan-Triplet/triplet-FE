import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import SmallBtn from "../button/SmallBtn";

import gather from "../../assets/icon/gather.svg";
import calendar from "../../assets/icon/calendar-blue.svg"

/**
 * @param {object} props
 * @param {string} props.thumbnail
 * @param {string} props.title
 * @param {string} props.members
 * @param {string} props.dateRange
 * @param {function} props.onDetail
 */
export default function TripList({
  thumbnail,
  title,
  members,
  dateRange,
  onDetail,
}) {
  return (
    <TripWrap>
      <TripImg>
        <img
          src={thumbnail}
          alt={`${title} 썸네일`}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='210' height='260'><rect width='100%' height='100%' fill='#EEEEEE'/></svg>`
              );
          }}
        />
      </TripImg>

      <TripInfo>
        <Title>{title}</Title>

        <TripSummary>
          <Summary>
            <img src={gather} alt="참여자 아이콘"/>
            <SummaryText>{members}</SummaryText>
          </Summary>

          <Summary>
            <img src={calendar} alt="달력 아이콘"/>
            <SummaryText>{dateRange}</SummaryText>
          </Summary>
        </TripSummary>

        <SmallBtn
          label="상세보기"
          onClick={onDetail}
          bgColor={colors.blue400}
          textColor={colors.white}
          width="100%"
        />
      </TripInfo>
    </TripWrap>
  );
}

const TripWrap = styled.div`
  display: flex;
  flex-direction: column;

  background: ${colors.white};
  border: 1px solid ${colors.gray300};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  padding: 0;
  overflow: hidden;

  width: 100%;d
  box-sizing: border-box;
`;

const TripImg = styled.div`
  width: 100%;
  height: 260px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

const TripInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Title = styled.div`
  ${fontSet.body2_b};
  color: ${colors.black};
`;

const TripSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Summary = styled.div`
  height: 40px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const SummaryText = styled.span`
  ${fontSet.body3_m};
  color: ${colors.black};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

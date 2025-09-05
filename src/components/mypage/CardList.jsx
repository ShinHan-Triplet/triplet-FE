// src/components/mypage/CardList.jsx
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import SmallBtn from "../button/SmallBtn";

/**
 * 단일 카드 아이템
 * @param {object} props
 * @param {string} props.thumbnail
 * @param {string} props.name
 * @param {string} props.nickname
 * @param {'active'|'paused'|'waiting'} props.status
 * @param {string} props.maskedNumber
 * @param {string} props.linkedAccount
 * @param {function} props.onManage
 */
export default function CardList({
  thumbnail,
  name,
  nickname,
  status = "active",
  maskedNumber,
  linkedAccount,
  onManage,
}) {
  const statusText =
    status === "paused"
      ? "일시 정지"
      : status === "waiting"
      ? "사용 대기 중"
      : "사용 중";

  const statusColor =
    status === "paused"
      ? colors.error
      : status === "waiting"
      ? colors.yellow500
      : colors.blue500;

  return (
    <CardWrap>
      {/* 1열: 썸네일 */}
      <CardImg>
        <img
          src={thumbnail}
          alt={`${name} 썸네일`}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='110' height='110'><rect width='100%' height='100%' fill='#EEEEEE'/></svg>`
              );
          }}
        />
      </CardImg>

      {/* 2열: 좌측 정보 */}
      <Left>
        <TitleRow>
          <Title>{name}</Title>
          {nickname && (
            <>
              <Bar />
              <Nickname>{nickname}</Nickname>
            </>
          )}
        </TitleRow>

        <Number>{maskedNumber}</Number>

        {linkedAccount && (
          <AccountChip>연결된 계좌 : {linkedAccount}</AccountChip>
        )}
      </Left>

      {/* 3열: 우측 상태/버튼 */}
      <Right>
        <Status style={{ color: statusColor }}>{statusText}</Status>
        <SmallBtn
          label="카드 관리"
          onClick={onManage}
          bgColor={colors.blue400}
          textColor={colors.white}
          width={120}
        />
      </Right>
    </CardWrap>
  );
}

const CardWrap = styled.div`
  display: grid;
  grid-template-columns: 110px 340px 120px;
  align-items: stretch;
  gap: 20px;

  padding: 20px;
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
`;

const CardImg = styled.div`
  width: 110px;
  height: 110px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: center;
`;

const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Bar = styled.span`
  width: 2px;
  height: 16px;
  background: ${colors.gray800};
  display: inline-block;
`;

const Nickname = styled.div`
  ${fontSet.detail};
  color: ${colors.gray600};
`;

const Number = styled.div`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const AccountChip = styled.div`
  ${fontSet.detail};
  color: ${colors.gray700};
  background: ${colors.gray100};
  border-radius: 8px;
  padding: 10px 14px;
  display: inline-block;
  box-shadow: ${shadows.card};
  width: fit-content;
`;

const Right = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 6px 0;
`;

const Status = styled.div`
  ${fontSet.body3_m};
  text-align: right;
`;

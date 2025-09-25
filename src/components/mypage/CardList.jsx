import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import SmallBtn from "../button/SmallBtn";
import gatherIcon from "../../assets/icon/gather.svg";
import cardIcon from "../../assets/icon/card.svg";

export default function CardList({
  thumbnail,
  name,
  nickname,
  status,
  maskedNumber,
  linkedAccount,
  onDetail,
  width,
  checkGather,
}) {
  const STATUS_META = Object.freeze({
    1: { text: "사용 중",     color: colors.blue500 },
    2: { text: "일시 정지",   color: colors.error },
    3: { text: "사용 대기 중", color: colors.yellow500 },
  });

  const fromLabelToCode = (s) => {
    if (s === "active") return 1;
    if (s === "paused") return 2;
    if (s === "waiting") return 3;
    return NaN;
  };

  let code;
  if (typeof status === "number") {
    code = status;
  } else if (typeof status === "string") {
    const labeled = fromLabelToCode(status);
    code = Number.isNaN(labeled) ? parseInt(status, 10) : labeled;
  }
  if (![1, 2, 3].includes(code)) code = 1;

  const statusText = STATUS_META[code].text;
  const statusColor = STATUS_META[code].color;

  const hasStatus = status !== undefined && status !== null;
  const hasRight = hasStatus || Boolean(onDetail);

  const columns = [
    thumbnail ? "110px" : null,
    "1fr",
    hasRight ? "120px" : null,
  ].filter(Boolean).join(" ");

  return (
    <CardWrap $columns={columns} $width={width}>
      {thumbnail && (
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
      )}
      <Left>
        <TitleRow>
          <Title>
            {checkGather === true && <IconImg src={gatherIcon} alt="모임카드" />}
            {checkGather === false && <IconImg src={cardIcon} alt="개인카드" />}
            {name}
          </Title>
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

      {hasRight && (
        <Right>
          {hasStatus && (
            <Status style={{ color: statusColor }}>{statusText}</Status>
          )}
          {onDetail && (
            <SmallBtn
              label="카드 관리"
              onClick={onDetail}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={120}
            />
          )}
        </Right>
      )}
    </CardWrap>
  );
}

const CardWrap = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: stretch;
  height: 150px;
  gap: 20px;
  padding: 20px 28px;
  background: ${colors.white};
  border: 1px solid ${colors.gray300};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  width: ${({ $width }) => $width || "650px"};
  box-sizing: border-box;
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
  justify-content: space-between;
  align-self: stretch;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  ${fontSet.body2_m};
  color: ${colors.black};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 4px;
`;

const Bar = styled.span`
  width: 2px;
  height: 16px;
  background: ${colors.gray800};
  display: inline-block;
`;

const Nickname = styled.div`
  ${fontSet.detail};
  color: ${colors.black};
`;

const Number = styled.div`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const AccountChip = styled.div`
  ${fontSet.detail};
  color: ${colors.gray700};
  background: ${colors.gray100};
  border-radius: 5px;
  padding: 8px 16px;
  display: inline-block;
  width: fit-content;
`;

const Right = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const Status = styled.div`
  ${fontSet.body3_b};
  text-align: right;
`;

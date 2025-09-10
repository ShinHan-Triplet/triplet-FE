import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";

import SmallBtn from "../button/SmallBtn";
import GatherIcon from "../../assets/icon/gather_black.svg";

export default function GatherList({
  name,
  members = [],
  isOwner = false,
  linkedCard,
  width,
  onAddMember,
  onDelete,
  onLeave,
}) {
  const cardName =
    typeof linkedCard === "string" ? linkedCard : linkedCard?.name || "-";

  return (
    <CardWrap width={650}>
      <Left>
        <TitleRow>
          <Title>{name}</Title>
        </TitleRow>
        
        <Members title={members.join(", ")}>
          <img src={GatherIcon} alt="멤버 아이콘" />
          {members.join(", ")}
        </Members>

        {linkedCard && <AccountChip>연결된 카드 : {cardName}</AccountChip>}
      </Left>

      <Right>
        <Role style={{ color: isOwner ? colors.blue500 : colors.yellow500 }}>
          {isOwner ? "모임장" : "구성원"}
        </Role>
        {isOwner ? (
          <BtnRow>
            <SmallBtn
              label="모임 삭제"
              onClick={onDelete}
              bgColor={colors.gray200}
              textColor={colors.gray700}
              hoverBgColor={colors.gray300}
              width={120}
            />
            <SmallBtn
              label="멤버 추가"
              onClick={onAddMember}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={120}
            />
          </BtnRow>
        ) : (
          <SmallBtn
            label="모임 탈퇴"
            onClick={onLeave}
            bgColor={colors.gray200}
            textColor={colors.gray700}
            hoverBgColor={colors.gray300}
            width={120}
          />
        )}
      </Right>
    </CardWrap>
  );
}

const CardWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  height: 150px;
  gap: 20px;
  padding: 20px 28px;
  background: ${colors.white};
  border: 1px solid ${colors.gray300};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  width: 650px;
  box-sizing: border-box;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
  height: 110px;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Title = styled.div`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Members = styled.div`
  ${fontSet.detail};
  color: ${colors.black};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
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

const Role = styled.div`
  ${fontSet.body3_b};
  text-align: right;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

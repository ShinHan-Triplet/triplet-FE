import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";

import acceptedIcon from "../../assets/icon/check.svg";
import declinedIcon from "../../assets/icon/x.svg";

export default function NotificationsDropdown({
  open,
  items = [],
  onApprove,
  onReject,
  onClose,
  anchorRef,
}) {
  if (!open) return null;

  return (
    <DropdownWrap ref={anchorRef}>
      <Title>알림</Title>
      <DropdownList>
        {items.length === 0 ? (
          <Empty>새 알림이 없어요.</Empty>
        ) : (
          items.map((n) => (
            <Row key={n.invite_id}>
              <Msg>
                [{n.gather_name}] 모임에 초대되었습니다.
              </Msg>

              {n.status === 1 ? (
                <BtnGroup>
                  <BtnOk onClick={() => { onApprove(n); onClose(); }}>
                    <img src={acceptedIcon} alt="승인" style={{ width: 24, height: 24 }} />
                  </BtnOk>
                  <BtnNo onClick={() => { onReject(n); onClose(); }}>
                    <img src={declinedIcon} alt="거절" style={{ width: 24, height: 24 }} />
                  </BtnNo>
                </BtnGroup>
              ) : (
                <Badge $ok={n.status === 2}>
                  {n.status === 2 ? "수락됨" : "거절됨"}
                </Badge>
              )}
            </Row>
          ))
        )}
      </DropdownList>
    </DropdownWrap>
  );
}

const DropdownWrap = styled.div`
  position: absolute;
  top: 54px;
  right: 0;
  width: 320px;
  background: ${colors.white};
  border: 1px solid ${colors.gray300};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  z-index: 2000;
`;

const Title = styled.div`
  ${fontSet.body2_b};
  padding: 12px 24px;
  color: ${colors.black};
  border-bottom: 1px solid ${colors.gray200};
    box-shadow: ${shadows.card};
  text-align: left;
`;

const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${colors.white};
  border-radius: 8px;
  padding: 10px 8px;
`;

const Msg = styled.div`
  ${fontSet.body3_m};
  color: ${colors.black};
  width: 172px;
  margin-right: 20px;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Btn = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
 `;

const BtnOk = styled(Btn)`
  background: ${colors.gray100};
  padding: 8px;

  &:hover {
    background: ${colors.blue50};
  }
`;
const BtnNo = styled(Btn)`
  background: ${colors.gray100};
  padding: 8px;

  &:hover {
    background: ${colors.error50};
  }
`;

const Badge = styled.span`
  ${fontSet.detail};
  width: 88px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $ok }) => ($ok ? colors.blue50 : colors.error50)};
  color: ${({ $ok }) => ($ok ? colors.blue500 : colors.error)};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Empty = styled.div`
  ${fontSet.body3_m};
  color: ${colors.gray500};
  padding: 16px 8px;
  text-align: center;
`;

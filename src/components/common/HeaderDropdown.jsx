import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";

export default function HeaderDropdown({ open, onSelect, onClose, anchorRef }) {
  if (!open) return null;
  
  const handleMypage = () => {
    onSelect("mypage");
    setTimeout(onClose, 0);
  };

  return (
    <DropdownWrap ref={anchorRef}>
      <DropdownList>
        <DropdownItem onClick={handleMypage}>
          <DropdownText>마이페이지</DropdownText>
        </DropdownItem>
        <DropdownItem onClick={() => { onSelect("logout"); onClose(); }}>
          <DropdownText>로그아웃</DropdownText>
        </DropdownItem>
      </DropdownList>
    </DropdownWrap>
  );
}

const DropdownWrap = styled.div`
  position: absolute;
  top: 54px;
  right: 0;
  min-width: 160px;
  background: ${colors.white};
  border: 1px solid ${colors.gray300};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  z-index: 2000;
`;

const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  padding:12px;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const DropdownText = styled.div`
  ${fontSet.body3_m};
  background: ${colors.white};
  border-radius: 8px;
  color: ${colors.black};
  padding: 12px 0;
  text-align: center;
  transition: background 0.2s;

  ${DropdownItem}:hover & {
    background: ${colors.gray200};
  }
`
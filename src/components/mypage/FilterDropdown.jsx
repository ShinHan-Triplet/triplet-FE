import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import dropIcon from "../../assets/icon/chevron-down-m.svg";

export default function FilterDropdown({
  label = "카테고리",
  value,
  options = [],
  onChange,
  width,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedLabel = options.includes(value) ? value : label;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <Wrap ref={ref} $w={width}>
      <Trigger type="button" onClick={() => setOpen((v) => !v)}>
          <TriggerLabel>{selectedLabel}</TriggerLabel>
          <DropIcon src={dropIcon} alt="" />
      </Trigger>

      {open && (
        <Menu>
          {options.map((opt) => (
            <MenuItem
              key={opt}
              $active={opt === value}
              onClick={() => {
                onChange?.(opt);
                setOpen(false);
              }}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  width: 116px;
`;

const Trigger = styled.button`
  ${fontSet.body3_m};
  position: relative;
  width: 116px;
  height: 45px;
  border-radius: 12px;
  box-sizing: border-box;
  border: 1px solid ${colors.gray200};
  background: ${colors.gray100};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover { background: ${colors.gray200}; }
`;

const TriggerLabel = styled.span`
  color: ${colors.black};
  text-align: center;
  margin: 8px;
`;

const DropIcon = styled.img`
  width: 24px;
  height: 24px;
  pointer-events: none;
  user-select: none;
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 116px;
  box-sizing: border-box;
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  padding: 6px;
  margin: 0;
  list-style: none;
  z-index: 10;
`;

const MenuItem = styled.li`
  ${fontSet.body3_m};
  padding: 10px 12px;
  border-radius: 8px;
  color: ${({ $active }) => ($active ? colors.blue600 : colors.gray900)};
  background: transparent;
  text-align: center;
  cursor: pointer;

  &:hover { background: ${colors.gray100}; }
`;

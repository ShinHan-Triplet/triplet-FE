import styled from "styled-components";
import { useState } from "react";
import NotChecked from "../../../assets/icon/checkbox_no.svg";
import Checked from "../../../assets/icon/checkbox_yes.svg";

export default function CheckBox({
  checked,
  defaultChecked = false,
  onChange,
}) {
  const isControlled = typeof checked === "boolean";
  const [internal, setInternal] = useState(defaultChecked);
  const value = isControlled ? checked : internal;

  function toggle(e) {
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next, e);
  }

  const onKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(e);
    }
  };

  return (
    <Check
      type="button"
      role="checkbox"
      aria-checked={value}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <img src={value ? Checked : NotChecked} alt="" aria-hidden />
    </Check>
  );
}

const Check = styled.button`
  width: 29px;
  height: 29px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
`;

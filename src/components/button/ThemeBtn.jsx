import styled from "styled-components";
import fontSet from "../../styles/fonts";
import colors from "../../styles/colors";

export default function ThemeBtn({
  label,
  onClick,
  selected = false,
  bgColor = colors.gray200,
  textColor = colors.black,
  width,
  hoverBgColor = colors.gray300,
  selectedBgColor = colors.blue100,
  selectedHoverBgColor = colors.blue200,
}) {
  return (
    <Btn
      onClick={onClick}
      aria-pressed={selected}
      $selected={selected}
      $bgColor={bgColor}
      $textColor={textColor}
      $width={width}
      $hoverBgColor={hoverBgColor}
      $selectedBgColor={selectedBgColor}
      $selectedHoverBgColor={selectedHoverBgColor}
    >
      {label}
    </Btn>
  );
}

const Btn = styled.button`
  ${fontSet.body2_m};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  background: ${({ $selected, $bgColor, $selectedBgColor }) =>
    $selected ? $selectedBgColor : $bgColor};
  color: ${({ $textColor }) => $textColor};

  /*width 처리 : 숫자면 px, 문자열이면 그대로 적용*/
  width: ${({ $width }) =>
    $width == null
      ? "auto"
      : typeof $width === "number"
      ? `${$width}px`
      : $width};

  &:hover:not(:disabled) {
    background: ${({ $selected, $hoverBgColor, $selectedHoverBgColor }) =>
      $selected ? $selectedHoverBgColor : $hoverBgColor};
  }

  &:active:not(:disabled) {
    background: ${({ $selected, $hoverBgColor, $selectedHoverBgColor }) =>
      $selected ? $selectedHoverBgColor : $hoverBgColor};
  }
`;

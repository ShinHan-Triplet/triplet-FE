import styled from "styled-components";
import fontSet from "../../styles/fonts";
import colors from "../../styles/colors";

export default function MediumBtn({
  label,
  onClick,
  bgColor = colors.blue400,
  textColor = colors.white,
  width,
  hoverBgColor = colors.blue500,
  disabled = false,
}) {
  return (
    <Btn
      onClick={onClick}
      $bgColor={bgColor}
      $textColor={textColor}
      $width={width}
      $hoverBgColor={hoverBgColor}
      disabled={disabled}
    >
      {label}
    </Btn>
  );
}

const Btn = styled.button`
  ${fontSet.body3_b};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};

  /*width 처리 : 숫자면 px, 문자열이면 그대로 적용*/
  width: ${({ $width }) =>
    $width == null
      ? "auto"
      : typeof $width === "number"
      ? `${$width}px`
      : $width};

  &:hover:not(:disabled) {
    background: ${({ $hoverBgColor }) => $hoverBgColor};
    color: ${({ $textColor }) => $textColor};
  }

  &:active:not(:disabled) {
    background: ${({ $hoverBgColor }) => $hoverBgColor};
    color: ${({ $textColor }) => $textColor};
  }

  &:disabled {
    cursor: not-allowed;
    background: ${colors.gray300};
    color: ${colors.white};
  }
`;

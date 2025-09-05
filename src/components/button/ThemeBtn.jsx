import styled from "styled-components";
import fontSet from "../../styles/fonts";

export default function ThemeBtn({
  label,
  onClick,
  bgColor,
  textColor,
  width,
}) {
  return (
    <Btn
      onClick={onClick}
      $bgColor={bgColor}
      $textColor={textColor}
      $width={width}
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

  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};

  /*width 처리 : 숫자면 px, 문자열이면 그대로 적용*/
  width: ${({ $width }) =>
    $width == null
      ? "auto"
      : typeof $width === "number"
      ? `${$width}px`
      : $width};
`;

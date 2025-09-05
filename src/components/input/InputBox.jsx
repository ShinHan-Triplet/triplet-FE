import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";

export default function InputBox({
  placeholder,
  width,
  ...rest
}) {
  return <StyledInput placeholder={placeholder} $width={width} {...rest} />;
}

const StyledInput = styled.input`
  ${fontSet.body3_m};
  width: ${(props) => props.$width || "100%"};
  height: auto;
  padding: 16px 32px;

  background: ${colors.white};
  border: 1px solid ${colors.gray400};
  border-radius: 10px;
  color: ${colors.black};

  &::placeholder {
    color: ${colors.gray400};
  }

  &:focus {
    outline: none;
    border-color: ${colors.gray800};
  }
`;

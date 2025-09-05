import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import { useNavigate } from "react-router-dom";
import leftIcon from "../../assets/icon/chevron-left-m.svg";

export default function BackBtn({ url = "", text = "" }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (url) {
      navigate(url);
    } else {
      navigate(-1);
    }
  };

  return (
    <IconBtn onClick={handleClick}>
      <img src={leftIcon} alt="이전" />
      <IconText>{text}</IconText>
    </IconBtn>
  );
}

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
`;
const IconText = styled.div`
  ${fontSet.body2_m}
  color: ${colors.gray700};
`;

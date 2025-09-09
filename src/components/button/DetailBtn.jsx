import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import { useNavigate } from "react-router-dom";
import rightIcon from "../../assets/icon/chevron-right-m.svg";

export default function BackBtn({ url = "", text = "" }) {
  const navigate = useNavigate();
  const handleClick = () => {
      navigate(url);
  };

  return (
    <IconBtn onClick={handleClick}>
      <IconText>{text}</IconText>
      <img src={rightIcon} alt="우측아이콘" />
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
  padding: 0;
  
  img {
    width: 24px;
    height: 24px;
  }
`;
const IconText = styled.div`
  ${fontSet.body3_m}
  color: ${colors.gray700};
`;

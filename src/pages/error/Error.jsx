import styled, { keyframes, css } from "styled-components";
import { useState } from "react";
import background from "../../assets/img/background/loginBg.png";
import error from "../../assets/logo/error.png";
import { useNavigate } from "react-router-dom";
import LargeBtn from "../../components/button/LargeBtn";
import colors from "../../styles/colors";

const portNum = process.env.REACT_APP_PORT_NUM;

export default function Login() {
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);

  const gotoMain = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 220);
  };

  return (
    <BgWrap>
      <Bg src={background} alt="메인 배경" />
      <LoginText src={error} alt="error" />
      <BtnCover>
        <LargeBtn
          label="홈으로 이동"
          onClick={gotoMain}
          bgColor={colors.yellow400}
          hoverBgColor={colors.yellow500}
          textColor={colors.white}
          width={220}
        ></LargeBtn>
      </BtnCover>
    </BgWrap>
  );
}

const BtnCover = styled.div`
  position: fixed;
  left: 50%;
  bottom: 180px;
  transform: translateX(-50%);
  z-index: 1;
`;

const BgWrap = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
`;

const Bg = styled.img`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const LoginText = styled.img`
  position: fixed;
  left: 50%;
  top: 170px;
  transform: translateX(-50%);
  width: 361px;
  height: 189px;
  object-fit: cover;
  z-index: 1;
`;

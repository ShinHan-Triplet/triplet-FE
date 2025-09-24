import styled, { keyframes, css } from "styled-components";
import { useState } from "react";
import background from "../../assets/img/background/loginBg.png";
import loginText from "../../assets/img/background/loginText.png";
import loginBtnImg from "../../assets/img/LoginBtn.png";
import loginBtnHoverImg from "../../assets/img/LoginBtnHover.png";
import logo from "../../assets/logo/logo.svg";
import { useNavigate } from "react-router-dom";
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
      <LoginText src={loginText} alt="로그인 텍스트" />
      <MainLogo
        type="button"
        aria-label="홈으로"
        onClick={gotoMain}
        $animating={animating}
      />
      <LoginBtn
        type="button"
        aria-label="네이버로 로그인"
        onClick={() => {
          window.location.href = `http://localhost:${portNum}/oauth2/authorization/naver`;
        }}
      />
    </BgWrap>
  );
}

const pop = keyframes`
  0%   { transform: translateX(-50%) scale(1); }
  50%  { transform: translateX(-50%) scale(1.06); }
  100% { transform: translateX(-50%) scale(1); }
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
  top: 180px;
  transform: translateX(-50%);
  width: 532px;
  height: 224px;
  object-fit: cover;
  z-index: 1;
`;

const MainLogo = styled.button`
  position: fixed;
  left: 50%;
  top: 230px;
  transform: translateX(-50%);
  width: 338px;
  height: 114px;
  z-index: 2;
  background: url(${logo}) no-repeat center / contain;
  border: none;
  cursor: pointer;

  ${({ $animating }) =>
    $animating &&
    css`
      animation: ${pop} 220ms ease-out both;
      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`;

const LoginBtn = styled.button`
  position: fixed;
  left: 50%;
  bottom: 140px;
  transform: translateX(-50%);
  width: 320px;
  height: 50px;
  border: none;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  z-index: 2;

  background-image: url(${loginBtnImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;

  &:hover {
    background-image: url(${loginBtnHoverImg});
  }
  &:active {
    transform: translateX(-50%) scale(0.985);
  }
  &:focus-visible {
    outline: none;
  }
`;

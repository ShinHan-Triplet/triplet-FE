import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";

import logo from "../../assets/logo/logo2.png";

export default function Footer() {
  return (
    <FooterWrap>
        <FooterTop>
          <FooterLinks>
            <a href="/terms">서비스 이용약관</a>
            <span>|</span>
            <a href="/privacy">개인정보 처리방침</a>
          </FooterLinks>
          <LogoBox>
            <img src={logo} alt="Triplet" />
          </LogoBox>
        </FooterTop>

      <Divider />

      <FooterBottom>
        <LeftText>COPYRIGHT © TRIPLET. All rights reserved.</LeftText>
        <RightText>서울특별시 마포구 월드컵북로4길 77 ANT빌딩 1층</RightText>
      </FooterBottom>
    </FooterWrap>
  );
}

const FooterWrap = styled.footer`
  width: 100%;
  padding: 40px 20px;
  margin-top: 240px;
  background: ${colors.gray100};
  color: ${colors.gray700};
`;

const FooterTop = styled.div`
  max-width: 1056px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FooterLinks = styled.div`
  ${fontSet.body3_m};
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;

  a {
    color: ${colors.gray700};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.gray700};
  margin: 16px auto 16px auto;
  max-width: 1056px;
`;

const FooterBottom = styled.div`
  max-width: 1056px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const LeftText = styled.div`
  ${fontSet.detail};
  color: ${colors.gray700};
`;

const RightText = styled.div`
  ${fontSet.detail};
  color: ${colors.gray700};
`;

const LogoBox = styled.div`
  margin: 0 24px 0 0;
  img {
    height: 110px;
    display: block;
  }
`;

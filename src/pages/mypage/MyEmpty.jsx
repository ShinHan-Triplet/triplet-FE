import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import logo from "../../assets/logo/logo2.png";

export default function Empty({ title, desc, action, className }) {
  return (
    <EmptyWrap className={className}>
      <IconBox>
        <img src={logo} alt="Triplet" />
      </IconBox>
      {title && <Title>{title}</Title>}
      {desc && <Desc>{desc}</Desc>}
      {action && <ActionBox>{action}</ActionBox>}
    </EmptyWrap>
  );
}

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const IconBox = styled.div`
  img {
    width: 100px;
    height: auto;
    display: block;
    opacity: 30%;
  }
`;

const Title = styled.div`
  ${fontSet.body2_b};
  color: ${colors.black};
`;

const Desc = styled.div`
  ${fontSet.body3_m};
  color: ${colors.gray700};
`;

const ActionBox = styled.div`
  margin-top: 12px;
`;

// src/components/common/Empty.jsx
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";

export default function Empty({ icon, title, desc, action, className }) {
  return (
    <EmptyWrap className={className}>
      {icon && <IconBox>{icon}</IconBox>}
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

  button {
    ${fontSet.body2_m};
    height: 44px;
    padding: 0 20px;
    background: ${colors.blue500};
    color: ${colors.white};
    border: 0;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
      background: ${colors.blue400};
    }
  }
`;

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import close from "../../assets/icon/close.svg";

export default function ModalForCard({ card, onClose }) {
  const [closing, setClosing] = useState(false);
  const handleClose = () => setClosing(true);

  return (
    <ModalBg data-state={closing ? "closing" : "open"}>
      <ModalContainer
        data-state={closing ? "closing" : "open"}
        onAnimationEnd={(e) => {
          if (closing && e.currentTarget === e.target) {
            onClose();
          }
        }}
      >
        <ModalTop>
          <ModalName>카드 상세보기</ModalName>
          <CloseButton onClick={handleClose}>
            <img src={close} alt="close" />
          </CloseButton>
        </ModalTop>
        <Line />
        <ModalContent>
          <ModalMain>
            <ModalTitle>{card?.name}</ModalTitle>
            <ModalSub>{card.tagline}</ModalSub>
            <>
              {card?.desc.map((desc, index) => (
                <ModalDesc key={index}>{desc}</ModalDesc>
              ))}
            </>
          </ModalMain>
          <ModalText>주요 혜택</ModalText>
          <ModalBenefit>
            {card?.benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <BenefitExp>{benefit.title}</BenefitExp>
                <BenefitNum>{benefit.content}</BenefitNum>
              </BenefitItem>
            ))}
          </ModalBenefit>
        </ModalContent>
      </ModalContainer>
    </ModalBg>
  );
}

const overlayShow = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const contentShowUpVH = keyframes`
  from { opacity: 0; transform: translateY(8vh); }
  to   { opacity: 1; transform: translateY(0); }
`;

const overlayHide = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const contentHideDown = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(8vh); }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &[data-state="open"] {
    animation: ${overlayShow} 180ms ease-out forwards;
  }
  &[data-state="closing"] {
    animation: ${overlayHide} 180ms ease-out forwards;
  }
`;

const ModalContainer = styled.div`
  width: 718px;
  height: 581px;
  background: ${colors.white};
  position: relative;
  border-radius: 10px;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &[data-state="open"] {
    animation: ${contentShowUpVH} 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  &[data-state="closing"] {
    animation: ${contentHideDown} 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const ModalTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 48px;
`;

const ModalContent = styled.div`
  display: flex;
  width: 622px;
  height: 389px;
  flex-direction: column;
  padding: 56px 48px;
`;

const ModalName = styled.div`
  ${fontSet.body2_b}
  display: flex;
  align-items: center;
`;
const CloseButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: ${colors.gray300};
`;

const ModalMain = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalText = styled.div`
  ${fontSet.body2_b}
  text-align: center;
  margin-top: 28px;
  margin-bottom: 22px;
`;

const ModalTitle = styled.div`
  ${fontSet.heading2}
  color: ${colors.blue500};
  text-align: center;
  margin-bottom: 16px;
`;

const ModalSub = styled.div`
  ${fontSet.body2_b}
  margin-bottom: 20px;
  color: ${colors.gray800};
  text-align: center;
`;
const ModalDesc = styled.div`
  ${fontSet.body3_b}
  color: ${colors.gray600};
  text-align: center;
  margin-bottom: 8px;
`;

const ModalBenefit = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const BenefitItem = styled.div`
  display: flex;
  gap: 8px;
`;

const BenefitExp = styled.div`
  ${fontSet.body3_m}
  color: ${colors.gray800};
`;

const BenefitNum = styled.div`
  ${fontSet.detail}
  color: ${colors.gray600};
`;

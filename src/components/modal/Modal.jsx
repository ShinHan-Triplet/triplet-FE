import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import close from "../../assets/icon/close.svg";
import MediumBtn from "../button/MediumBtn";
import InputBox from "../input/InputBox";
import FilterDropdown from "../mypage/FilterDropdown";

const ID_TO_LABEL = Object.freeze({
  1: "숙박비",
  2: "보험비",
  3: "식비",
  4: "교통비",
  5: "여가비",
  6: "기타",
});

export default function Modal({
  title = "",
  def1 = "",
  def2 = "",
  type = 1,
  btnLabel = "홈으로",
  onClose,
  categoryId = null,
  text = "",
  func1 = () => {},
  func2 = () => {},
}) {
  const [closing, setClosing] = useState(false);
  const handleClose = () => setClosing(true);
  const [category, setCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (type !== 3) return;
    const initial =
      typeof categoryId === "string"
        ? categoryId
        : ID_TO_LABEL[Number(categoryId)] || "기타";
    setCategory(initial);
    setMemo(text ?? "");
  }, [type, categoryId, text]);

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
          <ModalName>{title}</ModalName>
          {(type === 2 || type === 3) && (
            <CloseButton onClick={handleClose}>
              <img src={close} alt="close" />
            </CloseButton>
          )}
        </ModalTop>
        <Line />
        <ModalContent>
          <ModalDefList>
            <ModalDef>{def1}</ModalDef>
            <ModalDef>{def2}</ModalDef>
          </ModalDefList>
          {type === 1 && (
            <ModalBtnList>
              <MediumBtn
                label={btnLabel}
                width={120}
                bgColor={colors.gray200}
                textColor={colors.black}
                hoverBgColor={colors.gray300}
                onClick={() => {
                  func1();
                  handleClose();
                }}
              />
              <MediumBtn
                label="확인"
                width={120}
                onClick={() => {
                  func2();
                  handleClose();
                }}
              />
            </ModalBtnList>
          )}
          {type === 2 && (
            <>
              <InputBox
                placeholder="이메일을 입력해주세요"
                width={480}
                value={inputValue}
                onChange={(v) => setInputValue(v?.target ? v.target.value : v)}
              />
              <ModalBtnList>
                <MediumBtn
                  label="취소"
                  width={120}
                  bgColor={colors.gray200}
                  textColor={colors.black}
                  hoverBgColor={colors.gray300}
                  onClick={handleClose}
                />
                <MediumBtn
                  label="확인"
                  width={120}
                  onClick={() => {
                    func2(inputValue);
                    handleClose();
                  }}
                />
              </ModalBtnList>
            </>
          )}
          {type === 3 && (
            <>
              <Contain>
                <FilterDropdown
                  label="카테고리"
                  value={category}
                  onChange={setCategory}
                  options={["숙박비", "보험비", "식비", "교통비", "여가비", "기타"]}
                />
                <InputBox placeholder={text} width={358} value={memo} onChange={(e) => setMemo(e?.target ? e.target.value : e)}/>
              </Contain>
              <ModalBtnList>
                <MediumBtn
                  label="취소"
                  width={120}
                  bgColor={colors.gray200}
                  textColor={colors.black}
                  hoverBgColor={colors.gray300}
                  onClick={handleClose}
                />
                <MediumBtn 
                  label="확인"
                  width={120}
                  onClick={() => {
                    const nextMemo = (memo ?? "").trim();
                    func2({
                      memo: nextMemo === (text ?? "") ? undefined : nextMemo,
                      categoryLabel: category,
                    });
                    handleClose();
                  }}
                />
              </ModalBtnList>
            </>
          )}
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

const Contain = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
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
  width: 576px;
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
  width: 480px;
  flex-direction: column;
  padding: 56px 48px;
  align-items: center;
  gap: 36px;
`;

const ModalDefList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const ModalBtnList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const ModalDef = styled.div`
  ${fontSet.body2_m}
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

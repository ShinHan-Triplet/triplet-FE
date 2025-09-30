import React from "react";
import styled from "styled-components";
import colors from "../../../styles/colors";
import fontSet from "../../../styles/fonts";
import calendar from "../../../assets/icon/calendar-gray.svg";
import close from "../../../assets/icon/close.svg";

export default function DateForMain({ start, end }) {
  return (
    <PickerContainer>
      <Date>
        {start} - {end}
      </Date>
      <Icon>
        <img src={close} alt="닫기 아이콘" width={20} height={20} />
        <img src={calendar} alt="달력 아이콘" width={24} height={24} />
      </Icon>
    </PickerContainer>
  );
}

const PickerContainer = styled.div`
  width: 280px;
  height: 54px;
  border: 1px solid ${colors.gray400};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 32px;
  pointer: none;
`;
const Date = styled.div`
  ${fontSet.body3_b}
  color: ${colors.black};
  pointer: none;
`;
const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

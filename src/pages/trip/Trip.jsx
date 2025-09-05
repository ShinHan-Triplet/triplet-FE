import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import ThemeBtn from "../../components/button/ThemeBtn";
import { DateRangePicker } from "./components/DateRange";
import { useState } from "react";

export default function Trip() {
  const [range, setRange] = useState({ start: null, end: null });

  return (
    <Container>
      <Title>
        <MainTitle>여행 계획 작성</MainTitle>
        <SubTitle>여행 준비, 가볍게 시작해볼까요?</SubTitle>
      </Title>

      <div>
        <BackBtn url="" text="이전" />
        <Fill>
          <BlueTitle>여행 정보 수집</BlueTitle>
          <Contents>
            <Detail>
              <DetailTitle>여행 이름</DetailTitle>
            </Detail>
            <Detail>
              <DetailTitle>여행 테마</DetailTitle>
              <ThemeBtn
                label="식도락"
                textColor={colors.black}
                bgColor={colors.gray200}
                width={160}
              />
              <ThemeBtn
                label="액티비티"
                textColor={colors.black}
                bgColor={colors.gray200}
                width={160}
              />
              <ThemeBtn
                label="힐링"
                textColor={colors.black}
                bgColor={colors.gray200}
                width={160}
              />
              <ThemeBtn
                label="기타"
                textColor={colors.black}
                bgColor={colors.gray200}
                width={160}
              />
            </Detail>
            <Detail>
              <DetailTitle>여행 일정</DetailTitle>
              <DateRangePicker
                value={range}
                onChange={setRange}
                locale="ko-KR"
              />
            </Detail>
            <Detail>
              <DetailTitle>여행 대표사진</DetailTitle>
            </Detail>
          </Contents>
        </Fill>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 1060px;
  flex-direction: column;
  align-items: flex-start;
  gap: 80px;
  background: transparent;
  margin-top: 100px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const Fill = styled.div`
  width: 880px;
  margin-left: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
`;

const BlueTitle = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  margin-top: 40px;
  margin-bottom: 24px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
`;

const DetailTitle = styled.div`
  ${fontSet.body2_m}
  color: ${colors.black};
  width: 160px;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainTitle = styled.div`
  ${fontSet.heading1}
`;

const SubTitle = styled.div`
  ${fontSet.heading2}
`;

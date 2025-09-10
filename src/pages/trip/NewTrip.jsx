import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import MediumBtn from "../../components/button/MediumBtn";
import ThemeBtn from "../../components/button/ThemeBtn";
import InputBox from "../../components/input/InputBox";
import { DateRangePicker } from "./components/DateRange";
import { useState } from "react";
import LargeBtn from "../../components/button/LargeBtn";
import { useNavigate } from "react-router-dom";

export default function NewTrip() {
  const [range, setRange] = useState({ start: null, end: null });

  const navigate = useNavigate();

  const toStartOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDaysInclusive = (s, e) => {
    if (!s || !e) return 0;
    const start = toStartOfDay(s);
    const end = toStartOfDay(e);
    return Math.round((end - start) / 86400000) + 1;
  };

  const nextPage = () => {
    if (!range.start || !range.end) {
      alert("여행 일정을 선택해주세요.");
      return;
    }
    const days = diffDaysInclusive(range.start, range.end);

    // state에 안전하게 밀리초 타임스탬프를 넣어 전달 (타임존 이슈 방지)
    navigate("/trip/new/cost", {
      state: {
        startMs: range.start.getTime(),
        endMs: range.end.getTime(),
        days,
      },
    });
  };

  return (
    <Container>
      <Title>
        <MainTitle>여행 계획 작성</MainTitle>
        <SubTitle>여행 준비, 가볍게 시작해볼까요?</SubTitle>
      </Title>

      <div>
        <BackBtn url="/trip" text="이전" />
        <Fill>
          <BlueTitle>여행 정보 수집</BlueTitle>
          <Contents>
            <Detail>
              <DetailTitle>여행 이름</DetailTitle>
              <InputBox
                placeholder="여행 제목은 알아보기 쉽게 작성해주세요"
                width={700}
              ></InputBox>
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
              <Photo>
                <InputBox
                  placeholder="파일을 선택해주세요"
                  width={520}
                ></InputBox>
                <MediumBtn
                  label="파일선택"
                  bgColor={colors.blue400}
                  textColor={colors.white}
                  width={160}
                ></MediumBtn>
              </Photo>
            </Detail>
          </Contents>
        </Fill>
      </div>
      <BtnSpace>
        <LargeBtn
          label="다음"
          onClick={nextPage}
          bgColor={colors.blue400}
          textColor={colors.white}
          width={180}
        ></LargeBtn>
      </BtnSpace>
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

const Photo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
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

const BtnSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

const MainTitle = styled.div`
  ${fontSet.heading1}
`;

const SubTitle = styled.div`
  ${fontSet.heading2}
`;

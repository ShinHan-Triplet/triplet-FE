import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import MediumBtn from "../../components/button/MediumBtn";
import ThemeBtn from "../../components/button/ThemeBtn";
import InputBox from "../../components/input/InputBox";
import { DateRangePicker } from "../../components/trip/DateRange";
import { useState, useRef, useEffect } from "react";
import LargeBtn from "../../components/button/LargeBtn";
import { useNavigate } from "react-router-dom";
import {
  clearTripDraft,
  loadTripDraft,
  saveTripDraft,
} from "./TripDraftSession";

const THEMES = ["식도락", "액티비티", "힐링", "기타"];
const themeToNum = (t) => {
  const idx = THEMES.indexOf(t);
  return idx >= 0 ? idx + 1 : 1; // 1~4
};
const numToTheme = (n) => THEMES[(n ?? 1) - 1] ?? THEMES[0];

// const toStartOfDay = (d) =>
//   new Date(d.getFullYear(), d.getMonth(), d.getDate());
// const diffDaysInclusive = (s, e) => {
//   if (!s || !e) return 0;
//   const start = toStartOfDay(s);
//   const end = toStartOfDay(e);
//   return Math.round((end - start) / 86400000) + 1;
// };

export default function NewTrip() {
  const navigate = useNavigate();

  const [range, setRange] = useState({ start: null, end: null });
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // 파일명만 표시
    }
  };

  // 처음 진입 - 세션에 이전 기록이 있으면 이어쓰기 묻기
  useEffect(() => {
    const snap = loadTripDraft();
    if (!snap) return;

    setTitle(snap.title ?? "");
    setTheme(numToTheme(snap.themeNum));
    setRange({
      start: snap.startMs ? new Date(snap.startMs) : null,
      end: snap.endMs ? new Date(snap.endMs) : null,
    });
  }, []);

  // 상태가 바뀌면 600ms 후에 세션에 자동 저장
  const saveTimer = useRef();
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const startMs = range.start ? toStartOfDay(range.start).getTime() : null;
      const endMs = range.end ? toStartOfDay(range.end).getTime() : null;

      const hasMeaningful = !!title.trim() || !!theme || (startMs && endMs);

      if (!hasMeaningful) {
        // 전부 빈 상태면 세션에 빈 드래프트를 남기지 말고 제거
        const existed = loadTripDraft();
        if (existed) clearTripDraft();
        return; // 저장 스킵
      }
      const themeNum = themeToNum(theme);
      saveTripDraft({
        title,
        themeNum,
        startMs: range.start ? toStartOfDay(range.start).getTime() : null,
        endMs: range.end ? toStartOfDay(range.end).getTime() : null,
      });
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [title, theme, range.start, range.end]);

  const toStartOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDaysInclusive = (s, e) => {
    if (!s || !e) return 0;
    const start = toStartOfDay(s);
    const end = toStartOfDay(e);
    return Math.round((end - start) / 86400000) + 1;
  };

  const nextPage = () => {
    if (!title.trim()) {
      alert("여행 이름을 입력해주세요.");
      return;
    } else if (!theme) {
      alert("여행 테마를 선택해주세요.");
      return;
    } else if (!range.start || !range.end) {
      alert("여행 일정을 선택해주세요.");
      return;
    }
    const days = diffDaysInclusive(range.start, range.end);
    const themeNum = themeToNum(theme);

    saveTripDraft({
      title,
      themeNum,
      startMs: toStartOfDay(range.start).getTime(),
      endMs: toStartOfDay(range.end).getTime(),
    });

    // state에 안전하게 밀리초 타임스탬프를 넣어 전달 (타임존 이슈 방지)
    navigate("/trip/new/cost", {
      state: {
        startMs: range.start.getTime(),
        endMs: range.end.getTime(),
        days,
        title,
        theme,
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></InputBox>
            </Detail>
            <Detail>
              <DetailTitle>여행 테마</DetailTitle>
              {THEMES.map((t) => (
                <ThemeBtn
                  key={t}
                  label={t}
                  selected={theme === t}
                  onClick={() => setTheme(t)}
                  width={160}
                  textColor={colors.black}
                />
              ))}
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
                  value={fileName}
                  readOnly
                ></InputBox>
                <MediumBtn
                  label="파일선택"
                  bgColor={colors.blue400}
                  textColor={colors.white}
                  width={160}
                  onClick={() => fileInputRef.current.click()}
                ></MediumBtn>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
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

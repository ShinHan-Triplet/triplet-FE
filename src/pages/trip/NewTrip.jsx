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
  getDraft,
  patchDraft,
  clearDraftRemote,
  presignCover,
  confirmCover,
} from "../../lib/draft";
import { ensureAccessToken } from "../../lib/api";

const THEMES = ["식도락", "액티비티", "힐링", "기타"];
const themeToNum = (t) => {
  const idx = THEMES.indexOf(t);
  return idx >= 0 ? idx + 1 : 1; // 1~4
};
const numToTheme = (n) => THEMES[(n ?? 1) - 1] ?? THEMES[0];

export default function NewTrip() {
  const navigate = useNavigate();

  const [range, setRange] = useState({ start: null, end: null });
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const fileInputRef = useRef(null);
  const saveTimer = useRef(null);

  const toStartOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDaysInclusive = (s, e) => {
    if (!s || !e) return 0;
    const start = toStartOfDay(s);
    const end = toStartOfDay(e);
    return Math.round((end - start) / 86400000) + 1;
  };

  // 1. 마운트 시 Redis 초안 로드
  useEffect(() => {
    (async () => {
      try {
        await ensureAccessToken(window.location);
        setAuthReady(true);
        const res = await getDraft();
        if (!res?.hasDraft) return;
        const d = res.draft;
        setTitle(d.title ?? "");
        setTheme(numToTheme(d.themeNum));
        setRange({
          start: d.startMs ? new Date(d.startMs) : null,
          end: d.endMs ? new Date(d.endMs) : null,
        });
        setFileName(d.cover?.fileName || "");
      } catch (e) {
        setAuthReady(false);
      }
    })();
  }, []);

  // 2. 자동 저장(디바운스 600ms) -> redis
  useEffect(() => {
    if (!authReady) return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await ensureAccessToken();
      } catch {
        return; // 로그인 필요
      }

      const startMs = range.start ? toStartOfDay(range.start).getTime() : null;
      const endMs = range.end ? toStartOfDay(range.end).getTime() : null;
      const hasMeaningful =
        !!title.trim() || !!theme || (startMs && endMs) || !!fileName;

      if (!hasMeaningful) {
        try {
          await clearDraftRemote();
        } catch {}
        return;
      }

      const themeNum = themeToNum(theme);
      try {
        await patchDraft({
          title,
          themeNum,
          startMs,
          endMs,
          // 대표사진은 confirmCover에서 cover 객체로 별도 저장되므로 여기선 fileName만 참고 표시 용
        });
      } catch (e) {
        console.error("draft save failed", e);
      }
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [title, theme, range.start, range.end, fileName, authReady]);

  // 3.대표사진 선택 -> S3 presign 업로드 -> 초안에 cover 저장
  const handleFileChange = async (e) => {
    if (!authReady) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setFileName(file.name);

      // 3-1 presign
      const presigned = await presignCover({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      });
      // 3-2 실제 업로드 (PUT to S3)
      await fetch(presigned.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      // 3-3 초안에 cover 메타 반영
      await confirmCover({
        fileName: file.name,
        objectKey: presigned.objectKey,
        contentType: file.type || "application/octet-stream",
        size: file.size,
        viewUrl: presigned.viewUrl, // 미리보기 URL
      });
    } catch (e) {
      console.error("cover upload failed", e);
      alert("대표사진 업로드에 실패했습니다.");
      setFileName("");
    } finally {
      setUploading(false);
      // 같은 파일 다시 선택 가능하도록 초기화
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
    } else if (!fileName) {
      alert("여행 대표사진을 선택해주세요.");
      return;
    }
    const days = diffDaysInclusive(range.start, range.end);
    const themeNum = themeToNum(theme);

    navigate("/trip/new/cost", {
      state: {
        startMs: range.start.getTime(),
        endMs: range.end.getTime(),
        days,
        title,
        theme,
        tripImg: fileName,
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
                maxLength={20}
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

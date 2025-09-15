// DemoTypingTitle.jsx
import React from "react";
import styled from "styled-components";
import InputBox from "../input/InputBox";
/**
 * 사용법: <TripWritor />
 * - 외형은 InputBox와 유사한 '가짜 입력 UI'로 렌더링됩니다.
 * - 사용자는 포커스/입력할 수 없고, 화면에 자동 타자만 보여줘요.
 */
export default function TripWritor({
  texts = [
    "제주 먹짱투어 3박 4일",
    "계획없는 번개액션",
    "추억쌓기 대작전~!!",
    "신혼여행",
  ],
  width = 344,
  typeMs = 95,
  eraseMs = 55,
  holdMs = 1200,
  gapMs = 600,
  startDelayMs = 250,
  placeholder = "여행 제목은 알아보기 쉽게 작성해주세요",
  useFallback = false,
  onAdvance, // ★ 추가: 다음 문장으로 넘어갈 때 (다 지우고 새 타이핑 직전) 불림. 인자: nextIndex
}) {
  const [display, setDisplay] = React.useState("");
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function run() {
      setDisplay("");
      setStarted(false);
      await sleep(startDelayMs);
      if (!active) return;
      setStarted(true);

      while (active && texts?.length > 0) {
        for (let i = 0; i < texts.length && active; i++) {
          const s = String(texts[i] ?? "");

          // 타이핑
          for (let j = 1; j <= s.length && active; j++) {
            setDisplay(s.slice(0, j));
            await sleep(typeMs);
          }

          // 유지
          if (!active) break;
          await sleep(holdMs);

          // 지우기
          for (let j = s.length - 1; j >= 0 && active; j--) {
            setDisplay(s.slice(0, j));
            await sleep(eraseMs);
          }

          // 다음 문장으로 넘어가는 순간 알림 (지우기 완료 → gap 대기 끝나고 새 타이핑 직전)
          const nextIndex = (i + 1) % texts.length;
          if (active && typeof onAdvance === "function") {
            onAdvance(nextIndex);
          }

          // 다음 문장 전 잠깐 쉼
          if (!active) break;
          await sleep(gapMs);
        }
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [JSON.stringify(texts), typeMs, eraseMs, holdMs, gapMs, startDelayMs]);

  if (!useFallback) {
    return (
      <InputBox
        width={width}
        value={display}
        readOnly
        aria-readonly="true"
        style={{ pointerEvents: "none" }}
        placeholder={started ? "" : placeholder}
      />
    );
  }

  return (
    <FakeInput $width={width} aria-readonly="true">
      <span aria-hidden="true">{display}</span>
      {!started && !display && <Placeholder>{placeholder}</Placeholder>}
    </FakeInput>
  );
}

const FakeInput = styled.div`
  width: ${({ $width }) => ($width == null ? "auto" : `${$width}px`)};
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  display: flex;
  align-items: center;
  position: relative;
  font-size: 16px;
  line-height: 1.25;
  user-select: none;
  pointer-events: none;
`;
const Placeholder = styled.span`
  position: absolute;
  left: 16px;
  color: rgba(0, 0, 0, 0.36);
  pointer-events: none;
`;

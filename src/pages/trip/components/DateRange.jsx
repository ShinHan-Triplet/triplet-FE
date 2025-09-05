import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import colors from "../../../styles/colors";
import fontSet from "../../../styles/fonts";
import calendar from "../../../assets/icon/calendar-gray.svg";
import close from "../../../assets/icon/close.svg";
import left from "../../../assets/icon/chevron-left-s.svg";
import right from "../../../assets/icon/chevron-right-s.svg";

/**
 * Lightweight, dependency‑free DateRangePicker (styled-components version)
 * - Pure React (no MUI/date libs)
 * - 시작일/종료일 선택, 역순 클릭 시 자동 스왑
 * - Hover 미리보기, 범위 하이라이트, min/max 지원, 바깥 클릭 닫힘
 * - Controlled/Uncontrolled 모두 지원
 */

// ===== Utilities =====
const pad = (n) => n.toString().padStart(2, "0");
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const isBefore = (a, b) => startOfDay(a).getTime() < startOfDay(b).getTime();
const isAfter = (a, b) => startOfDay(a).getTime() > startOfDay(b).getTime();
const isBetween = (d, s, e) =>
  s && e && startOfDay(d) >= startOfDay(s) && startOfDay(d) <= startOfDay(e);
const clampDate = (d, min, max) => {
  if (!d) return d;
  if (min && isBefore(d, min)) return startOfDay(min);
  if (max && isAfter(d, max)) return startOfDay(max);
  return startOfDay(d);
};
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

function formatMMDDYYYY(d) {
  if (!d) return "";
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

function monthMatrix(viewDate, weekStartsOn = 0) {
  const firstOfMonth = startOfMonth(viewDate);
  const firstDayIdx = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstDayIdx);

  const weeks = [];
  let cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}

function getMonthLabel(d, locale = "ko-KR") {
  try {
    const month = d.toLocaleDateString(locale, { month: "long" });
    const year = d.toLocaleDateString(locale, { year: "numeric" });
    if (locale === "ko-KR") return `${year} ${month}`;
    return `${month} ${year}`;
  } catch {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}

const KO_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const EN_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// ===== Styles (styled-components) =====
const PickerContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FieldButton = styled.button`
  ${fontSet.detail}
  width: 320px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${colors.white};
  color: ${colors.black};
  border: 1px solid ${colors.gray400};
  border-radius: 10px;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover {
    border-color: ${colors.gray800};
  }
`;

const Placeholder = styled.span`
  color: ${colors.gray400};
`;

const Icon = styled.span`
  display: inline-flex;
  width: 55px;
  height: 20px;
`;

const ClearButton = styled.button`
  border: 0;
  background: transparent;
  display: inline-flex;
  width: 22px;
  height: 22px;
  margin-right: 12px;
  cursor: pointer;
`;

const Nothing = styled.div`
  border: 0;
  background: transparent;
  display: inline-flex;
  width: 22px;
  height: 22px;
  margin-right: 12px;
`;

const Popover = styled.div`
  margin-top: 8px;
  width: 360px;
  background: ${colors.white};
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 12px 24px ${colors.gray300};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  margin-bottom: 8px;
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  border: 0;
  background: transparent;
  border-radius: 10px;
  padding: 8px;
  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}
  &:hover {
    background: ${colors.gray200};
  }
`;

const MonthLabel = styled.div`
  ${fontSet.body3_b}
  color: ${colors.black};
  user-select: none;
`;

const Weekdays = styled.div`
  ${fontSet.detail}
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 0 4px;
  text-align: center;
  font-weight: 500;
  color: ${colors.blue500};
`;

const Weekday = styled.div`
  padding: 4px 0;
  user-select: none;
`;

const Grid = styled.div`
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 0 4px;
`;

const Cell = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
`;

const RangeBg = styled.div`
  position: absolute;
  inset: 0;
  background: ${colors.blue50};
  border-radius: 10px;
`;

const HalfBg = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
`;

const DayButton = styled.button`
  ${fontSet.detail}
  font-weight: 400;
  position: relative;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: ${(p) => (p.$inThisMonth ? "inherit" : colors.gray300)};
  ${(p) =>
    p.$disabled &&
    css`
      opacity: 0.3;
      cursor: not-allowed;
    `}
  ${(p) =>
    !p.$disabled &&
    css`
      cursor: pointer;
      &:hover {
        background: ${colors.blue300};
      }
    `}
  ${(p) =>
    (p.$isStart || p.$isEnd) &&
    css`
      background: ${colors.blue300};
      color: #fff;
      &:hover {
        background: ${colors.blue300};
      }
    `}
  transition: background .15s ease;
`;

const Footer = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 12px;
  color: ${colors.gray500};
`;

const QuietButton = styled.button`
  ${fontSet.detail}
  border: 0;
  background: transparent;
  border-radius: 10px;
  padding: 6px 10px;
  color: ${colors.gray800};
  &:hover {
    background: ${colors.gray200};
  }
`;

// const PageWrap = styled.div`
//   min-height: 70vh;
//   width: 100%;
//   background: linear-gradient(#fff, rgb(255, 7, 7));
//   padding: 32px;
// `;

// const PageInner = styled.div`
//   max-width: 640px;
//   margin: 0 auto;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 8px;
//   font-size: 14px;
//   font-weight: 500;
//   color: #334155;
// `;

// const Info = styled.div`
//   margin-top: 24px;
//   font-size: 14px;
//   color: ${colors.black};
// `;

// ===== Core Component =====
function DateRangePicker({
  value, // { start: Date|null, end: Date|null }
  onChange,
  placeholder = "시작일 – 종료일",
  locale = "ko-KR",
  weekStartsOn = 0, // 0: Sun, 1: Mon
  minDate,
  maxDate,
  className = "",
}) {
  const isControlled = value && typeof onChange === "function";
  const [internal, setInternal] = useState({ start: null, end: null });
  const start = (isControlled ? value.start : internal.start) || null;
  const end = (isControlled ? value.end : internal.end) || null;

  const [open, setOpen] = useState(false);
  const initialView =
    clampDate(start || new Date(), minDate, maxDate) || new Date();
  const [viewDate, setViewDate] = useState(startOfMonth(initialView));
  const [hoverDate, setHoverDate] = useState(null);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handle);
      return () => document.removeEventListener("mousedown", handle);
    }
  }, [open]);

  const weeks = useMemo(
    () => monthMatrix(viewDate, weekStartsOn),
    [viewDate, weekStartsOn]
  );
  const weekdayLabels = locale === "ko-KR" ? KO_WEEKDAYS : EN_WEEKDAYS;

  function commit(next) {
    if (isControlled) onChange(next);
    else setInternal(next);
  }

  function handleDayClick(day) {
    if (minDate && isBefore(day, minDate)) return;
    if (maxDate && isAfter(day, maxDate)) return;

    if (!start || (start && end)) {
      commit({ start: startOfDay(day), end: null });
      setHoverDate(null);
    } else {
      let s = startOfDay(start);
      let e = startOfDay(day);
      if (isBefore(e, s)) [s, e] = [e, s];
      commit({ start: s, end: e });
      setOpen(false);
      setHoverDate(null);
    }
  }

  function handleDayMouseEnter(day) {
    if (start && !end) setHoverDate(day);
  }

  function clearSelection(e) {
    e.stopPropagation();
    commit({ start: null, end: null });
    setHoverDate(null);
  }

  const previewEnd =
    start && !end && hoverDate
      ? isBefore(hoverDate, start)
        ? start
        : hoverDate
      : end;
  const previewStart =
    start && !end && hoverDate
      ? isBefore(hoverDate, start)
        ? hoverDate
        : start
      : start;

  const displayText =
    start && previewEnd
      ? `${formatMMDDYYYY(previewStart)} – ${formatMMDDYYYY(previewEnd)}`
      : start
      ? `${formatMMDDYYYY(start)} – …`
      : "";

  const canPrev =
    !minDate ||
    isAfter(startOfMonth(addMonths(viewDate, 0)), startOfMonth(minDate));
  const canNext =
    !maxDate ||
    isBefore(endOfMonth(addMonths(viewDate, 0)), endOfMonth(maxDate));

  return (
    <PickerContainer className={className} ref={containerRef}>
      <FieldButton
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {displayText ? (
          <span>{displayText}</span>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}

        <Icon aria-hidden>
          {start || end ? (
            <ClearButton
              type="button"
              onClick={clearSelection}
              aria-label="날짜 범위 지우기"
            >
              <img src={close} alt="" />
            </ClearButton>
          ) : (
            <Nothing />
          )}
          <img src={calendar} alt="Triplet" />
        </Icon>
      </FieldButton>

      {open && (
        <Popover role="dialog" aria-label="기간 선택 달력">
          <Header>
            <NavBtn
              disabled={!canPrev}
              onClick={() => setViewDate((d) => addMonths(d, -1))}
              aria-label="이전 달"
            >
              <img src={left} alt="left" />
            </NavBtn>
            <MonthLabel>{getMonthLabel(viewDate, locale)}</MonthLabel>
            <NavBtn
              disabled={!canNext}
              onClick={() => setViewDate((d) => addMonths(d, 1))}
              aria-label="다음 달"
            >
              <img src={right} alt="Triplet" />
            </NavBtn>
          </Header>

          <Weekdays>
            {(locale === "ko-KR" ? KO_WEEKDAYS : EN_WEEKDAYS).map((w) => (
              <Weekday key={w}>{w}</Weekday>
            ))}
          </Weekdays>

          <Grid role="grid">
            {weeks.flat().map((day, idx) => {
              const inThisMonth = day.getMonth() === viewDate.getMonth();
              const disabled =
                (minDate && isBefore(day, minDate)) ||
                (maxDate && isAfter(day, maxDate));
              const isStart = start && isSameDay(day, previewStart);
              const isEnd = previewEnd && isSameDay(day, previewEnd);
              const inRange =
                previewStart &&
                previewEnd &&
                isBetween(day, previewStart, previewEnd);

              const showLeftCap =
                isStart && previewEnd && !isSameDay(previewStart, previewEnd);
              const showRightCap =
                isEnd && previewStart && !isSameDay(previewStart, previewEnd);

              return (
                <Cell key={idx} role="gridcell" aria-selected={inRange}>
                  {inRange && !(isStart || isEnd) && <RangeBg aria-hidden />}
                  {showLeftCap && <HalfBg aria-hidden />}
                  {showRightCap && <HalfBg aria-hidden />}

                  <DayButton
                    type="button"
                    aria-label={`${formatMMDDYYYY(day)}`}
                    onMouseEnter={() => handleDayMouseEnter(day)}
                    onFocus={() => handleDayMouseEnter(day)}
                    onClick={() => handleDayClick(day)}
                    disabled={disabled}
                    $disabled={disabled}
                    $inThisMonth={inThisMonth}
                    $isStart={!!isStart}
                    $isEnd={!!isEnd}
                  >
                    {day.getDate()}
                  </DayButton>
                </Cell>
              );
            })}
          </Grid>

          <Footer>
            <div>
              {start && !end && <span>종료일을 선택하세요</span>}
              {start && end && (
                <span>{`${formatMMDDYYYY(start)} – ${formatMMDDYYYY(
                  end
                )}`}</span>
              )}
              {!start && !end && <span>기간을 선택하세요</span>}
            </div>
            <QuietButton type="button" onClick={() => setOpen(false)}>
              닫기
            </QuietButton>
          </Footer>
        </Popover>
      )}
    </PickerContainer>
  );
}

// ===== Demo Wrapper (default export) =====
export default function Demo() {
  const [range, setRange] = useState({
    start: new Date(2022, 3, 17),
    end: new Date(2022, 3, 21),
  });
  return <DateRangePicker value={range} onChange={setRange} locale="ko-KR" />;
}

export { DateRangePicker };

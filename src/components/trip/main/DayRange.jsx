import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import DateRangePicker from "./DateForMain";
import DayCost from "./DayCostForMain";

export default function DayRange({
  step1 = 1500,
  step2 = 1500,
  step3 = 1500,
  exitMs = 550,
}) {
  const d1 = "09/14/2025";
  const d2 = "09/15/2025";

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const delay = phase === 0 ? step1 : phase === 1 ? step2 : step3;
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), delay);
    return () => clearTimeout(t);
  }, [phase, step1, step2, step3]);

  const range = phase === 0 ? { start: d1, end: d1 } : { start: d1, end: d2 };

  const showDay2 = phase > 0;
  const day2NoSchedule = phase === 1;

  const [renderDay2, setRenderDay2] = useState(showDay2);
  const [leaving, setLeaving] = useState(false);

  const [lastNoSchedule, setLastNoSchedule] = useState(day2NoSchedule);
  useEffect(() => {
    if (showDay2) setLastNoSchedule(day2NoSchedule);
  }, [showDay2, day2NoSchedule]);

  useEffect(() => {
    if (showDay2) {
      setLeaving(false);
      setRenderDay2(true);
    } else if (renderDay2) {
      setLeaving(true);
      const t = setTimeout(() => {
        setRenderDay2(false);
        setLeaving(false);
      }, exitMs);
      return () => clearTimeout(t);
    }
  }, [showDay2, renderDay2, exitMs]);

  return (
    <>
      <DatePick>
        <DateRangePicker start={range.start} end={range.end} />
      </DatePick>

      <DayMoney>
        <RowStatic>
          <DayCost
            day={1}
            food={75000}
            transport={15000}
            leisure={30000}
            etc={5000}
            width={880}
            noSchedule={false}
          />
        </RowStatic>

        {renderDay2 && (
          <RowTransition $leaving={leaving} $exitMs={exitMs}>
            <DayCost
              day={2}
              food={120000}
              transport={7500}
              leisure={24000}
              etc={38000}
              width={880}
              noSchedule={leaving ? lastNoSchedule : day2NoSchedule}
            />
          </RowTransition>
        )}
      </DayMoney>
    </>
  );
}

const fadeInUpSoft = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
    filter: saturate(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: saturate(1);
  }
`;

const fadeOutDownSoft = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
    filter: saturate(1);
  }
  to {
    opacity: 0;
    transform: translateY(8px);
    filter: saturate(0.92);
  }
`;

const pulseSoft = keyframes`
  0%   { transform: scale(0.995); box-shadow: 0 0 0 rgba(0,0,0,0); }
  40%  { transform: scale(1.005); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
  100% { transform: scale(1);     box-shadow: 0 0 0 rgba(0,0,0,0); }
`;

const DatePick = styled.div`
  margin-top: 52px;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  /* 날짜 영역은 변화가 잦으니 애니메이션 없음 */
`;

const DayMoney = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RowStatic = styled.div``;

const RowTransition = styled.div`
  ${({ $leaving, $exitMs }) =>
    $leaving
      ? css`
          animation: ${fadeOutDownSoft} ${$exitMs}ms ease both;
        `
      : css`
          animation: ${fadeInUpSoft} 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
        `};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

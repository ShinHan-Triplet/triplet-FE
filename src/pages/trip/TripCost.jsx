// TripCost.jsx (Redis 초안 연동 버전)
import * as React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import InputBox from "../../components/input/InputBox";
import LargeBtn from "../../components/button/LargeBtn";
import CategoryChip from "../../components/chip/CategoryChip";
import DayCost from "../../components/trip/DayCost";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

import { getDraft, patchDraft } from "../../lib/draft";
import { ensureAccessToken } from "../../lib/api";

const toStartOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const diffDaysInclusive = (s, e) => {
  if (!s || !e) return 0;
  const start = toStartOfDay(s);
  const end = toStartOfDay(e);
  return Math.round((end - start) / 86400000) + 1;
};

export default function TripCost() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [authReady, setAuthReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [dayTotals, setDayTotals] = useState({});
  const [daySnapshots, setDaySnapshots] = useState({});
  const [amounts, setAmounts] = useState({ stay: "", insurance: "" });

  const saveTimer = useRef(null);

  // days 계산 (라우터 state 우선)
  const [daysCount, setDaysCount] = useState(() => {
    if (state?.days) return state.days;
    const s = state?.startMs ? new Date(state.startMs) : null;
    const e = state?.endMs ? new Date(state.endMs) : null;
    return s && e ? diffDaysInclusive(s, e) : 0;
  });

  // 1) 마운트 시 토큰 확보 + 초안 불러오기
  useEffect(() => {
    (async () => {
      try {
        await ensureAccessToken(window.location);
        setAuthReady(true);

        const res = await getDraft();
        const d = res?.draft;
        if (!d) {
          setHydrated(true);
          return;
        }

        // budgets 복원
        if (d.budgets) {
          setAmounts({
            stay: String(d.budgets.stay ?? ""),
            insurance: String(d.budgets.insurance ?? ""),
          });
          setDaySnapshots(d.budgets.days ?? {});
        }

        // days가 없으면 초안의 날짜로 보정
        if (!state?.days && d.startMs && d.endMs) {
          setDaysCount(
            diffDaysInclusive(new Date(d.startMs), new Date(d.endMs))
          );
        }

        setHydrated(true);
      } catch {
        setAuthReady(false);
        setHydrated(true); // 읽기는 실패해도 화면은 그려줌
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) days 범위 바뀌면 snapshots 범위 정리
  useEffect(() => {
    if (!hydrated || !daysCount) return;
    setDaySnapshots((prev) => {
      const entries = Object.entries(prev).filter(
        ([k]) => Number(k) >= 1 && Number(k) <= daysCount
      );
      return Object.fromEntries(entries);
    });
  }, [daysCount, hydrated]);

  // 유틸
  const equalAmounts = (a = {}, b = {}) =>
    String(a.food ?? "") === String(b.food ?? "") &&
    String(a.transport ?? "") === String(b.transport ?? "") &&
    String(a.leisure ?? "") === String(b.leisure ?? "") &&
    String(a.etc ?? "") === String(b.etc ?? "");
  const equalSnapshot = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
      !!a.noSchedule === !!b.noSchedule && equalAmounts(a.amounts, b.amounts)
    );
  };
  const toDigits = (s) => String(s ?? "").replace(/\D/g, "");
  const formatDigits = (digits) =>
    digits === "" ? "" : new Intl.NumberFormat("ko-KR").format(Number(digits));

  const handleAmount = (key) => (e) => {
    const input = e.target.value;
    const digits = toDigits(input);
    if (digits === "" && input !== "") return;
    setAmounts((prev) => ({ ...prev, [key]: digits }));
  };

  const handleDaySnapshotChange = useCallback((day, snapshot) => {
    setDaySnapshots((prev) => {
      const prevSnap = prev[day];
      if (equalSnapshot(prevSnap, snapshot)) return prev;
      return { ...prev, [day]: snapshot };
    });
  }, []);

  const handleTotalChange = (dayIndex) => (total) => {
    setDayTotals((prev) => ({ ...prev, [dayIndex]: Number(total) || 0 }));
  };

  const stayPlusInsurance = useMemo(() => {
    const n = (v) => (v === "" ? 0 : Number(v));
    return n(amounts.stay) + n(amounts.insurance);
  }, [amounts]);

  const totalSum = useMemo(() => {
    const daySum = Object.values(dayTotals).reduce(
      (sum, v) => sum + (Number(v) || 0),
      0
    );
    return daySum + stayPlusInsurance;
  }, [dayTotals, stayPlusInsurance]);

  // 3) 자동 저장(디바운스 600ms) → Redis draft.budgets 에 저장
  useEffect(() => {
    if (!authReady || !hydrated) return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await ensureAccessToken();
      } catch {
        return;
      }

      // 의미 있는 데이터 존재 여부
      const hasTop = !!amounts.stay || !!amounts.insurance;
      const hasDays = Object.values(daySnapshots).some((d) => {
        if (!d) return false;
        const a = d.amounts || {};
        return (
          !!d.noSchedule || !!(a.food || a.transport || a.leisure || a.etc)
        );
      });

      // 데이터가 있으면 budgets 통째로 패치
      if (hasTop || hasDays) {
        await patchDraft({
          budgets: {
            stay: amounts.stay,
            insurance: amounts.insurance,
            days: daySnapshots,
          },
        });
      } else {
        // 비어 있으면 budgets 제거 시도(서버 upsertMerge에서 null 제거 처리 권장)
        try {
          await patchDraft({ budgets: null });
        } catch {
          /* 서버가 null 제거를 지원하지 않으면 그냥 스킵 */
        }
      }
    }, 600);

    return () => clearTimeout(saveTimer.current);
  }, [authReady, hydrated, amounts, daySnapshots]);

  const nextPage = () => navigate("/trip/new/companions");

  return (
    <Container>
      <Title>
        <MainTitle>여행 예산 계획</MainTitle>
        <SubTitle>앞으로 쓸 금액을 미리 정해두세요</SubTitle>
        <MiniTitle>
          세부적인 일정과 예산을 입력하면, 여행이 더 똑똑해집니다.
        </MiniTitle>
      </Title>

      <div>
        <BackBtn url="/trip/new/details" text="이전" />
        <Fill>
          <Contents>
            <AllCost>
              <BlueTitleAll>전체 예산</BlueTitleAll>
              <Tags>
                <Tag>
                  <CategoryChip type="stay" />
                  <Money>
                    <InputBox
                      placeholder="0"
                      width={256}
                      value={formatDigits(amounts.stay)}
                      onChange={handleAmount("stay")}
                      style={{ textAlign: "right" }}
                    />
                    <Won>원</Won>
                  </Money>
                </Tag>
                <Tag>
                  <CategoryChip type="insurance" />
                  <Money>
                    <InputBox
                      placeholder="0"
                      width={256}
                      value={formatDigits(amounts.insurance)}
                      onChange={handleAmount("insurance")}
                      style={{ textAlign: "right" }}
                    />
                    <Won>원</Won>
                  </Money>
                </Tag>
              </Tags>
              <BasisCost>
                <CostText>
                  기본 예산: {formatDigits(stayPlusInsurance)}원
                </CostText>
              </BasisCost>
            </AllCost>

            {Array.from({ length: Math.max(0, daysCount) }, (_, i) => {
              const day = i + 1;
              return (
                <DayCost
                  key={day}
                  day={day}
                  snapshot={daySnapshots[day]}
                  onSnapshotChange={(snap) =>
                    handleDaySnapshotChange(day, snap)
                  }
                  onTotalChange={handleTotalChange(day)}
                />
              );
            })}

            <TotalCost>총 예산: {totalSum.toLocaleString()}원</TotalCost>
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
        />
      </BtnSpace>
    </Container>
  );
}

/* styles — 기존 그대로 */
const TotalCost = styled.div`
  ${fontSet.body1_b} width:100%;
  display: flex;
  justify-content: center;
`;
const BasisCost = styled.div`
  ${fontSet.body1_b} display:flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
`;
const CostText = styled.div`
  ${fontSet.body2_m}
`;
const Won = styled.div`
  ${fontSet.body2_m} width:30px;
  text-align: right;
`;
const Money = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
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
  margin-top: 40px;
`;
const BlueTitleAll = styled.div`
  ${fontSet.heading3} color:${colors.blue500};
  margin-bottom: 24px;
  height: 29px;
`;
const BtnSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
const AllCost = styled.div`
  gap: 20px;
`;
const Tags = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;
const Tag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;
const MainTitle = styled.div`
  ${fontSet.heading1}
`;
const SubTitle = styled.div`
  ${fontSet.heading2}
`;
const MiniTitle = styled.div`
  ${fontSet.body1_m}
`;

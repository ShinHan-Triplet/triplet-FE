import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import ProgressBar from "../../components/mypage/ProgressBar";
import FilterDropdown from "../../components/mypage/FilterDropdown";
import Train from "../../assets/img/background/trip_history_bg.png";
import Cloud from "../../assets/img/background/train_cloud.png";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { toThemeKo } from "../../components/util/TripTheme";

const krw = (n = 0) => `${Number(n ?? 0).toLocaleString()}원`;
const hhmm = (iso) => {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

// 구름 좌표(고정)
const FIXED_POS = [
  { left: "10%", top: "58%" },
  { left: "20%", top: "52%" },
  { left: "30%", top: "48%" },
  { left: "40%", top: "54%" },
  { left: "50%", top: "50%" },
  { left: "60%", top: "56%" },
  { left: "70%", top: "50%" },
  { left: "80%", top: "44%" },
  { left: "90%", top: "48%" },
];

export default function MyTripReport() {
  const { id } = useParams();

  // 상세
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // 날짜 드롭다운
  const [dayOptions, setDayOptions] = useState([]);
  const [dayDates, setDayDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState("1일차");

  // 사용내역(선택 일자)
  const [usageItems, setUsageItems] = useState([]);

  // 1) 상세 호출
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api(`/api/mytrip/${id}`);
        if (!active) return;

        setView({
          ...data,
          theme: toThemeKo(data?.theme ?? data?.themes),
        });

        // 기간 → 드롭다운 옵션 생성
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const dates = [];
        const labels = [];
        let cur = new Date(start);
        let i = 1;
        while (cur.getTime() <= end.getTime()) {
          dates.push(new Date(cur));
          labels.push(`${i}일차`);
          cur.setDate(cur.getDate() + 1);
          cur.setHours(0, 0, 0, 0);
          i++;
        }
        setDayDates(dates);
        setDayOptions(labels);
        setSelectedDay(labels[0] ?? "1일차");
      } catch (e) {
        setErr(e?.message ?? "error");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // 2) 선택된 일자 사용내역 호출
  useEffect(() => {
    if (!view || dayDates.length === 0) return;
    const idx = Math.max(0, (parseInt(selectedDay, 10) || 1) - 1);
    const date = dayDates[idx];
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    let active = true;
    (async () => {
      try {
        const data = await api(`/api/mytrip/${id}/usages?date=${dateStr}`);
        if (!active) return;
        setUsageItems(data?.day?.items ?? []);
      } catch {
        setUsageItems([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, view, dayDates, selectedDay]);

  // 예산: 총/사용 합계
  const budgetPlanned = useMemo(
    () => (view?.budget ?? []).reduce((s, b) => s + (b?.planned ?? 0), 0),
    [view]
  );
  const budgetUsed = useMemo(
    () => (view?.budget ?? []).reduce((s, b) => s + (b?.used ?? 0), 0),
    [view]
  );

  if (loading) return <div style={{ padding: 40 }}>로딩중…</div>;
  if (err)
    return <div style={{ padding: 40, color: "red" }}>에러: {String(err)}</div>;
  if (!view) return null;

  return (
    <Wrapper>
      <TripReport>
        <BackBtn url={`/mypage/trip/${id}`} text="내 여행기록" />

        <Header>
          <TripTitle>{view.title}</TripTitle>
          <Status>{view.status}</Status>
        </Header>

        <ProgressBar
          category={"전체"}
          used={budgetUsed}
          total={budgetPlanned}
        />

        <DropdownWrap>
          <BoxSubtitle>일자별 지출 분석</BoxSubtitle>
          <FilterDropdown
            label="1일차"
            value={selectedDay}
            onChange={setSelectedDay}
            options={dayOptions}
          />
        </DropdownWrap>

        <TimelineStage>
          <Overlay>
            {(usageItems ?? []).slice(0, FIXED_POS.length).map((u, i) => (
              <Marker key={u.usageId ?? `${i}`} style={FIXED_POS[i]}>
                {hhmm(u.costDateTime)}
                <Tooltip className="tooltip">
                  <strong style={{ display: "block", marginBottom: 4 }}>
                    {u.memo ?? "-"}
                  </strong>
                  <span style={{ opacity: 0.85 }}>
                    {u.categoryName ?? "기타"} · {krw(u.amount)}
                  </span>
                </Tooltip>
              </Marker>
            ))}
          </Overlay>
        </TimelineStage>
      </TripReport>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.gray100};
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
`;

const CardBase = styled.div`
  background: ${colors.white};
  box-sizing: border-box;
  width: 1060px;
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  display: flex;
  flex-direction: column;
`;

const TripReport = styled(CardBase)`
  padding: 30px 70px;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DropdownWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 0 0;
`;

const BoxSubtitle = styled.div`
  ${fontSet.body2_b};
  color: ${colors.black};
`;

const TripTitle = styled.div`
  ${fontSet.heading2};
  color: ${colors.black};
`;

const Status = styled.span`
  ${fontSet.detail};
  background: ${colors.gray100};
  color: ${colors.gray700};
  padding: 8px 16px;
  border-radius: 5px;
`;

const TimelineStage = styled.div`
  position: relative;
  width: 100%;
  height: 613px;
  border-radius: 8px;
  background-image: url(${Train});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Marker = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 80px;
  background: url(${Cloud}) center / contain no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;

  ${fontSet.detail};
  color: ${colors.black};

  pointer-events: auto;
  cursor: pointer;
  z-index: 1;
  filter: drop-shadow(0 6px 12px rgba(255, 255, 255, 0.8));
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover {
    transform: translate(-50%, -50%) translateY(-2px);
    filter: drop-shadow(0 8px 16px rgba(255, 255, 255, 1));
  }

  &:focus-visible {
    outline: 2px solid ${colors.blue200};
    outline-offset: 2px;
  }

  &:hover > .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, calc(-50%));
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, calc(-50%));
  z-index: 10;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${colors.gray900};
  color: ${colors.white};
  ${fontSet.body3_m};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors.gray900};
  }
`;

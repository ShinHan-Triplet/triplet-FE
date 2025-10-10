import { useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import { useNavigate } from "react-router-dom";

import TripList from "../../components/mypage/TripList";
import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";
import { api } from "../../lib/api";

const S3_BASE_URL = "https://triplet-bucket.s3.ap-northeast-2.amazonaws.com";

function toThumb(src) {
  // 값이 없으면 TripList에서 기본 이미지 처리
  if (!src) return "";

  // 상대/파일명이면 S3 베이스와 합쳐서 출력
  const base = S3_BASE_URL.replace(/\/+$/, "");
  const path = String(src).replace(/^\/+/, "");
  return `${base}/${path}`;
}

function fmtDate(iso) {
  // '2025-05-03' -> '2025. 05. 03'
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${day}`;
}

export default function MyTrip() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api("/api/mytrip");
        const list = Array.isArray(res?.trips) ? res.trips : [];

        if (!mounted) return;

        // 데이터 가공
        const normalized = list.map((t) => ({
          id: t.tripId,
          title: t.title,
          members: Array.isArray(t.members)
            ? t.members.map((m) => m.name).join(", ")
            : "",
          dateRange: `${fmtDate(t.startDate)} ~ ${fmtDate(t.endDate)}`,
          thumbnail: toThumb(t.thumbnail || t.tripImg),
        }));

        setTrips(normalized);
        setErr("");
      } catch (e) {
        console.error(
          "GET /api/mytrip failed:",
          e?.status,
          e?.body || e?.message
        );
        if (mounted) setErr("내 여행 목록을 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Wrapper>
        <div>내 여행을 불러오는 중...</div>
      </Wrapper>
    );
  }

  if (err) {
    return (
      <Wrapper>
        <div style={{ color: colors.error }}>{err}</div>
      </Wrapper>
    );
  }

  const isEmpty = trips.length === 0;

  return (
    <Wrapper $isEmpty={isEmpty}>
      {isEmpty ? (
        <Empty
          title="아직 여행이 없어요."
          desc="Triplet에서 새로운 여행을 계획해보세요."
          action={
            <MediumBtn
              label="계획 세우기"
              onClick={() => navigate("/trip")}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={180}
            />
          }
        />
      ) : (
        <Grid>
          {trips.map((trip) => (
            <TripList
              key={trip.id}
              thumbnail={trip.thumbnail}
              title={trip.title}
              members={trip.members}
              dateRange={trip.dateRange}
              onDetail={() => navigate(`/mypage/trip/${trip.id}`)}
            />
          ))}
        </Grid>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  min-height: 420px;
  padding: 30px 70px;

  display: grid;
  grid-auto-rows: min-content;
  row-gap: 20px;

  ${({ $isEmpty }) =>
    $isEmpty &&
    `
    place-content: center;
    place-items: center;
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
`;

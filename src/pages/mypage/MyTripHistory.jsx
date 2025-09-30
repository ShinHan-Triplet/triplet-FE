import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";

import BackBtn from "../../components/button/BackBtn";
import FilterDropdown from "../../components/mypage/FilterDropdown";
import ProgressBar from "../../components/mypage/ProgressBar";
import HistoryList from "../../components/mypage/HistoryList";
import { api } from "../../lib/api";

const CATEGORY_LABEL = {
  1: "숙박비",
  2: "보험비",
  3: "식비",
  4: "교통비",
  5: "여가비",
  6: "기타",
};
const CATEGORY_ORDER = ["전체", ...Object.values(CATEGORY_LABEL)];

const LABEL_TO_ID = Object.fromEntries(
  Object.entries(CATEGORY_LABEL).map(([id, label]) => [label, Number(id)])
);

function toDateMMDD(iso) {
  if (!iso) return "";
  const s = String(iso);
  const datePart = s.includes("T") ? s.split("T")[0] : s;
  const [, mm, dd] = datePart.split("-");
  return `${mm}.${dd}`;
}

export default function MyTripHistory({ tripId }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("전체");
  const [array, setArray] = useState("최신순");
  const [history, setHistory] = useState([]);
  const location = useLocation();
  const card = location.state?.card;
  const budgets = location.state?.budgets;
  const totalFromDetail = location.state?.total;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const resp = await api(`/api/mytrip/${id}/history`);

        const cid = card?.mcardId ?? card?.id ?? null;

        const days = resp.day ? [resp.day] : [];
        setHistory(days);

        // 평탄화해서 histories 만들어주기 (mcardId 주입)
        const histories = days.flatMap((day) =>
          (day.items || []).map((h) => {
            const iso = String(h.costDateTime || day.date);
            const base = iso.includes("T") ? iso.split("T")[0] : iso;
            return {
              usageId: h.usageId,
              category: h.categoryId,
              memo: h.memo,
              usageCost: h.amount,
              costDate: base,
              mcardId: h.mcardId ?? cid,
            };
          })
        );
        setData({
          histories,
          budgets: resp.budgets ?? null,
          total: totalFromDetail ?? 0,
          cardName: resp.cardName ?? "",
          cardNickname: resp.cardNickname ?? "",
          account: resp.account ?? "",
        });
      } catch (e) {
        console.error("GET /api/mytrip/:id/history failed:", e);
        if (mounted) setErr("카드 사용 내역을 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // 히스토리 원본 → HistoryList용 아이템으로 변환
  const items = useMemo(() => {
    if (!data?.histories) return [];
    return data.histories.map((h) => {
      const label = CATEGORY_LABEL[h.category] ?? "기타";
      return {
        id: h.usageId,
        mcardId: h.mcardId ?? card?.mcardId ?? card?.id ?? null,
        date: toDateMMDD(h.costDate),
        isoDate: h.costDate,
        title: h.memo || "-",
        category: label,
        type: "expense",
        amount: h.usageCost,
      };
    });
  }, [data, card]);

  // 드롭다운(필터/정렬)
  const viewItems = useMemo(() => {
    let arr = items;
    if (category !== "전체") {
      arr = arr.filter((it) => it.category === category);
    }
    return [...arr].sort((a, b) => {
      if (array === "오래된 순") {
        return a.isoDate < b.isoDate
          ? -1
          : a.isoDate > b.isoDate
          ? 1
          : a.id - b.id;
      }
      return a.isoDate > b.isoDate
        ? -1
        : a.isoDate < b.isoDate
        ? 1
        : b.id - a.id;
    });
  }, [items, category, array]);

  // 카테고리별 예산
  const budgetsFromDetail = location.state?.budgets ?? [];
  const plannedByCategory = useMemo(
    () =>
      (budgetsFromDetail || []).reduce((acc, b) => {
        const label = b.category;
        const planned = Number(b.amount || 0);
        acc[label] = (acc[label] || 0) + planned;
        return acc;
      }, {}),
    [budgetsFromDetail]
  );

  // 사용 금액
  const used = useMemo(() => {
    const src = data?.histories ?? [];
    if (category === "전체") {
      return src.reduce((sum, h) => sum + (h.usageCost || 0), 0);
    }
    const catId = LABEL_TO_ID[category];
    return src
      .filter((h) => h.category === catId)
      .reduce((sum, h) => sum + (h.usageCost || 0), 0);
  }, [data, category]);

  // 전체 예산
  const total = useMemo(() => {
    if (category === "전체") {
      const sumAll = Object.values(plannedByCategory).reduce(
        (s, v) => s + v,
        0
      );
      return (location.state?.total ?? 0) || sumAll;
    }
    return plannedByCategory[category] ?? used;
  }, [category, plannedByCategory, used, location.state?.total]);

  if (loading) {
    return (
      <Wrapper>
        <HistoryDetail>
          <BackRow>
            <BackBtn url={`/mypage/trip/${id}`} text="내 여행기록" />
          </BackRow>
          <Empty>불러오는 중…</Empty>
        </HistoryDetail>
      </Wrapper>
    );
  }

  if (err || !data) {
    return (
      <Wrapper>
        <HistoryDetail>
          <BackRow>
            <BackBtn url={`/mypage/trip/${id}`} text="내 여행기록" />
          </BackRow>
          <Empty>{err || "데이터가 없어요."}</Empty>
        </HistoryDetail>
      </Wrapper>
    );
  }

  const handleSave = async (
    usageId,
    { memo, categoryLabel, mcardId: passedMcardId }
  ) => {
    const usedMcardId = passedMcardId ?? card?.mcardId ?? card?.id;
    if (!usedMcardId) {
      alert("카드 정보가 없어 저장할 수 없어요.");
      return;
    }

    const payload = {};
    if (categoryLabel) payload.category = LABEL_TO_ID[categoryLabel];
    if (memo !== undefined) payload.memo = (memo ?? "").trim();
    if (Object.keys(payload).length === 0) return;

    await api(`/api/mycard/${usedMcardId}/history/${usageId}`, {
      method: "PATCH",
      body: payload,
    });

    setData((prev) => ({
      ...prev,
      histories: (prev?.histories ?? []).map((h) =>
        h.usageId === usageId
          ? {
              ...h,
              category: payload.category ?? h.category,
              memo: payload.memo ?? h.memo,
            }
          : h
      ),
    }));
  };

  return (
    <Wrapper>
      <HistoryDetail>
        <BackRow>
          <BackBtn url={`/mypage/trip/${id}`} text="내 여행기록" />
        </BackRow>

        <HeaderBox>
          <TitleRow>
            <Name>{card?.productName ?? data?.cardName ?? ""}</Name>
            <Divider>|</Divider>
            <Nickname>{card?.nickname ?? data?.cardNickname ?? ""}</Nickname>
          </TitleRow>
          {(card?.account ?? data?.account) && (
            <Account>{card?.account ?? data?.account}</Account>
          )}
        </HeaderBox>

        <FilterRow>
          <FilterDropdown
            label="카테고리"
            value={category}
            onChange={setCategory}
            options={CATEGORY_ORDER}
          />
          <FilterDropdown
            label="정렬"
            value={array}
            onChange={setArray}
            options={["최신순", "오래된 순"]}
          />
        </FilterRow>

        <ProgressBar category={category} used={used} total={total} />

        <HistoryList
          items={viewItems}
          showBalance={false}
          showEdit
          onClickItem={(it) => console.log("click", it)}
          onSave={handleSave}
        />
      </HistoryDetail>
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

const HistoryDetail = styled(CardBase)`
  padding: 30px 70px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const BackRow = styled.div`
  align-self: flex-start;
`;

const HeaderBox = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const Name = styled.h2`
  ${fontSet.heading2};
  color: ${colors.black};
  margin: 0;
`;

const Divider = styled.span`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Nickname = styled.span`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Account = styled.div`
  ${fontSet.body2_m};
  color: ${colors.gray700};
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 4px;
`;

const FilterRow = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 10px;
  margin-top: 60px;
`;

const Empty = styled.div`
  ${fontSet.body2_m};
  color: ${colors.gray700};
  padding: 40px 0 20px;
  text-align: center;
`;

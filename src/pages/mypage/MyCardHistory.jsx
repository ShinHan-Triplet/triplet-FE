import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
  1: "식비",
  2: "교통비",
  3: "여가비",
  4: "기타",
};
const CATEGORY_ORDER = ["전체", ...Object.values(CATEGORY_LABEL)];

const LABEL_TO_ID = Object.fromEntries(
  Object.entries(CATEGORY_LABEL).map(([id, label]) => [label, Number(id)])
);

function toDateYYYYMMDD(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function MyCardHistory() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("전체");
  const [array, setArray] = useState("최신순");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const resp = await api(`/api/mycard/${id}/history`);
        if (!mounted) return;
        setData(resp);
      } catch (e) {
        console.error("GET /api/mycard/:id/history failed:", e?.status, e?.body || e?.message);
        if (mounted) setErr("카드 사용 내역을 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // 히스토리 원본 → HistoryList용 아이템으로 변환
  const items = useMemo(() => {
    if (!data?.histories) return [];
    return data.histories.map(h => {
      const label = CATEGORY_LABEL[h.category] ?? "기타";
      return {
        id: h.usageId,
        date: toDateYYYYMMDD(h.costDate),
        title: h.memo || "-",
        category: label,
        type: "expense",
        amount: h.usageCost,
      };
    });
  }, [data]);

  // 드롭다운(필터/정렬)
  const viewItems = useMemo(() => {
    let arr = items;
    if (category !== "전체") {
      arr = arr.filter(it => it.category === category);
    }
    arr = [...arr].sort((a, b) => {
      if (array === "오래된 순") return (a.date > b.date ? 1 : a.date < b.date ? -1 : b.id - a.id);
      return (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id - b.id);
    });
    return arr;
  }, [items, category, array]);

  // 진행바
  const used = useMemo(() => {
    const src = data?.histories ?? [];
    if (category === "전체") {
      return src.reduce((sum, h) => sum + (h.usageCost || 0), 0);
    }
    const catId = LABEL_TO_ID[category];
    return src
      .filter(h => h.category === catId)
      .reduce((sum, h) => sum + (h.usageCost || 0), 0);
  }, [data, category]);

  // 예산
  const total = useMemo(() => {
  const budgets = data?.budgets;
  if (!budgets) return 0;

  if (category === "전체") {
    return budgets.total ?? used;
  }
  const catId = LABEL_TO_ID[category];
  return budgets.byCategory?.[catId] ?? used;
}, [data, category, used]);

  if (loading) {
    return (
      <Wrapper>
        <HistoryDetail>
          <BackRow>
            <BackBtn url={`/mypage/card/${id}`} text="내 카드" />
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
            <BackBtn url={`/mypage/card/${id}`} text="내 카드" />
          </BackRow>
          <Empty>{err || "데이터가 없어요."}</Empty>
        </HistoryDetail>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HistoryDetail>
        <BackRow>
          <BackBtn url={`/mypage/card/${id}`} text="내 카드" />
        </BackRow>

        <HeaderBox>
          <TitleRow>
            <Name>{data.name}</Name>
            <Divider>|</Divider>
            <Nickname>{data.nickname}</Nickname>
          </TitleRow>
          {data.linkedAccount && <Account>{data.linkedAccount}</Account>}
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

        <ProgressBar
          category={category}
          used={used}
          total={total}
        />

        <HistoryList
          items={viewItems}
          showBalance={false}
          showEdit
          onClickItem={(it) => console.log("click", it)}
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

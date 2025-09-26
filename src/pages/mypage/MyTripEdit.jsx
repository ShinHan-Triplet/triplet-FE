import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
// import MediumBtn from "../../components/button/MediumBtn";
// import CardList from "../../components/mypage/CardList";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { api } from "../../lib/api";
import InputBox from "../../components/input/InputBox";
// import { toThemeKo } from "../../components/util/TripTheme";
import LargeBtn from "../../components/button/LargeBtn";
import MediumBtn from "../../components/button/MediumBtn";
import ThemeBtn from "../../components/button/ThemeBtn";
import { DateRangePicker } from "../../components/trip/DateRange";
import CategoryChip from "../../components/chip/CategoryChip";
import DayCost from "../../components/trip/DayCost";
import { toThemeKo, toThemeNum } from "../../components/util/TripTheme";

const mapDtoToView = (dto) => {
  if (!dto) return null;
  const start = dto.startDate;
  const end = dto.endDate;
  return {
    id: dto.tripId,
    title: dto.title ?? "-",
    status: dto.status ?? "",
    start: start,
    end: end,
    theme: toThemeKo(dto.theme),
    thumbnail: dto.thumbnail,
    budget: Array.isArray(dto.budget)
      ? dto.budget.map((b) => ({
          category: b.categoryName,
          amount: Number(b.planned ?? 0),
          used: Number(b.used ?? 0),
        }))
      : [],
  };
};
const THEMES = ["식도락", "액티비티", "힐링", "기타"];

export default function MyTripEdit() {
  const { id } = useParams();
  const [view, setView] = useState(null);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [fileName, setFileName] = useState("");
  const [dayTotals, setDayTotals] = useState({});
  //   const [range, setRange] = useState({ start: view?.start, end: view?.end });
  const [amounts, setAmounts] = useState({ stay: "", insurance: "" });
  const [cost, setCost] = useState([]);
  const [fileObj, setFileObj] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const toDigits = (s) => String(s ?? "").replace(/\D/g, "");
  const formatDigits = (digits) =>
    digits === "" ? "" : new Intl.NumberFormat("ko-KR").format(Number(digits));

  const handleAmount = (key) => (e) => {
    const input = e.target.value;
    const digits = toDigits(input);
    if (digits === "" && input !== "") return;
    setAmounts((prev) => ({ ...prev, [key]: digits }));
  };

  const stayPlusInsurance = useMemo(() => {
    const n = (v) => (v === "" ? 0 : Number(v));
    return n(amounts.stay) + n(amounts.insurance);
  }, [amounts]);

  //   const [daysCount, setDaysCount] = useState(() => {
  //       if (state?.days) return state.days;
  //       const s = state?.startMs ? new Date(state.startMs) : null;
  //       const e = state?.endMs ? new Date(state.endMs) : null;
  //       return s && e ? diffDaysInclusive(s, e) : 0;
  //     });

  // 달력 부분 (날짜 계산산)
  const toStartOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDaysInclusive = (s, e) => {
    if (!s || !e) return 0;
    const start = toStartOfDay(s);
    const end = toStartOfDay(e);
    return Math.round((end - start) / 86400000) + 1;
  };

  const toDateOrNull = (v) => {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const [y, m, d] = v.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };

  const [range, setRange] = useState({
    start: null,
    end: null,
  });
  const days = diffDaysInclusive(range.start, range.end);

  useEffect(() => {
    if (!view) return;
    setTitle(view.title ?? "");
    setTheme(view.theme ?? "");
    setFileName(view.thumbnail ?? "");
    setFileObj(null);
    setPreviewUrl("");
    setRange({
      start: toDateOrNull(view.start),
      end: toDateOrNull(view.end),
    });
    // 예산 카테고리 인덱스는 실제 데이터 구조에 맞게 조정
    const stayAmt = view.budget?.[0]?.amount ?? "";
    const insAmt = view.budget?.[1]?.amount ?? "";
    setAmounts({
      stay: String(stayAmt),
      insurance: String(insAmt),
    });
  }, [view]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // 동일 파일 다시 선택할 수 있게 값 초기화
    e.target.value = "";
    setFileObj(f);
    setFileName(f.name); // InputBox에 표시
    // 미리보기(이미지면)
    try {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } catch {}
  };

  useEffect(() => {
    setDayTotals((prev) => {
      const pruned = Object.fromEntries(
        Object.entries(prev).filter(
          ([k]) => Number(k) >= 1 && Number(k) <= days
        )
      );
      return pruned;
    });
  }, [days]);

  const toNum = (v) => {
    if (v === "" || v == null) return 0;
    if (typeof v === "number") return v;
    return Number(String(v).replace(/,/g, "")) || 0;
  };

  const totalSum = useMemo(() => {
    const daySum = Object.values(dayTotals).reduce(
      (sum, v) => sum + toNum(v),
      0
    );
    return daySum + stayPlusInsurance;
  }, [dayTotals, stayPlusInsurance]);

  const handleTotalChange = (dayIndex) => (total) => {
    setDayTotals((prev) => ({ ...prev, [dayIndex]: toNum(total) }));
  };

  const fileInputRef = useRef(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      setView(null);
      try {
        const res = await api(`/api/mytrip/${id}`);
        const costPlan = await api(`/api/mytrip/${id}/budgets`);
        console.log(costPlan);
        const payload = res?.data ?? res?.result ?? res;
        console.log(res);
        if (!alive) return;

        const mapped = mapDtoToView(payload);
        if (mapped) {
          setView(mapped);
          setCost(costPlan);
        } else {
          setView(null);
        }
      } catch (e) {
        if (!alive) return;
        console.error(
          "[Detail] api error:",
          e?.response?.status,
          e?.message,
          e?.response?.data
        );
      } finally {
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const nextPage = () => {};

  return (
    <Wrapper>
      <TripDetail>
        <BackBtn url={`/mypage/trip/${id}`} text="내 여행기록 상세" />
        <Container>
          <div>
            <Fill>
              <MainTitle>여행 정보 수정</MainTitle>
              <BlueTitle>여행 정보 수집</BlueTitle>
              <Contents>
                <Detail>
                  <DetailTitle>여행 이름</DetailTitle>
                  <InputBox
                    placeholder={view?.title ?? "-"}
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
                      // placeholder={view?.thumbnail}
                      width={520}
                      value={fileName ?? ""}
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
              <Contents>
                <AllCost>
                  <BlueTitleAll>전체 예산</BlueTitleAll>
                  <Tags>
                    <Tag>
                      <CategoryChip type="stay" />
                      <Money>
                        <InputBox
                          placeholder={formatDigits(view?.budget[0].amount)}
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
                          placeholder={formatDigits(view?.budget[1].amount)}
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

                {Array.from({ length: Math.max(0, days) }, (_, i) => {
                  const day = i + 1;
                  const item = cost?.[day - 1] || {};
                  return (
                    <DayCost
                      key={day}
                      day={day}
                      food={item.food ?? 0}
                      transport={item.transport ?? 0}
                      leisure={item.leisure ?? 0}
                      etc={item.etc ?? 0}
                      checkPlan={item.checkPlan}
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
              label="수정하기"
              onClick={nextPage}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={220}
            />
          </BtnSpace>
        </Container>
      </TripDetail>
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

const TripDetail = styled(CardBase)`
  padding: 30px 70px;
`;

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
  margin-top: 24px;
`;

const Fill = styled.div`
  width: 880px;
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
  margin-bottom: 80px;
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
  margin-bottom: 40px;
`;

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
const BlueTitleAll = styled.div`
  ${fontSet.heading3} color:${colors.blue500};
  margin-bottom: 24px;
  height: 29px;
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
  ${fontSet.heading2}
  margin-top: 20px;
`;

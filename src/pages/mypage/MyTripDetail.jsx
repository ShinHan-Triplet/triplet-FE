import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";
import BackBtn from "../../components/button/BackBtn";
import MediumBtn from "../../components/button/MediumBtn";
import CardList from "../../components/mypage/CardList";
import Modal from "../../components/modal/Modal";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { api, getAuthState } from "../../lib/api";
import { toThemeKo } from "../../components/util/TripTheme";

const pad2 = (n) => String(n).padStart(2, "0");
const formatDate = (d) => {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${y}. ${pad2(m)}. ${pad2(day)}`;
};
const formatDateRange = (s, e) => `${formatDate(s)} ~ ${formatDate(e)}`;

const CATEGORY_COLOR = {
  숙박비: colors.blue100,
  보험비: colors.blue100,
  식비: colors.green100,
  교통비: colors.yellow100,
  여가비: colors.purple100,
  기타: colors.pink100,
};
const getCategoryColor = (cat) => CATEGORY_COLOR[cat] || colors.blue400;

const CATEGORY_OVER_COLOR = {
  숙박비: colors.blue200,
  보험비: colors.blue200,
  식비: colors.green200,
  교통비: colors.yellow200,
  여가비: colors.purple200,
  기타: colors.pink200,
};
const getCategoryOverColor = (cat) =>
  CATEGORY_OVER_COLOR[cat] || getCategoryColor(cat);

const mapDtoToView = (dto) => {
  if (!dto) return null;

  const start = dto.startDate;
  const end = dto.endDate;

  let ownerId = null;
  if (Array.isArray(dto.members)) {
    const owner = dto.members.find((m) => m.checkOwner === true);
    ownerId = owner ? owner.memberId : null;
  }

  return {
    id: dto.tripId,
    title: dto.title ?? "-",
    groupName: dto.gatherName || undefined,
    members: Array.isArray(dto.members)
      ? dto.members.map((m) => m?.name ?? m?.memberName ?? "?")
      : [],
    ownerId: ownerId,
    dateRange: formatDateRange(start, end),
    status: dto.status ?? "",
    card: dto.card
      ? {
          productName: dto.card.cardName,
          nickname: dto.card.cardNickname ?? "",
          number: dto.card.cardNum,
          account: dto.card.account,
          checkGather: true,
        }
      : null,
    theme: toThemeKo(dto.theme ?? dto.themes),
    budget: Array.isArray(dto.budget)
      ? dto.budget.map((b) => ({
          category: b.categoryName,
          amount: Number(b.planned ?? 0),
          used: Number(b.used ?? 0),
        }))
      : [],
    total: Array.isArray(dto.budget)
      ? dto.budget.reduce((sum, b) => sum + Number(b.planned ?? 0), 0)
      : 0,
  };
};

export default function MyTripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleConfirmDelete = async () => {
    try {
      await api(`/api/mytrip/${view.id}`, { method: "DELETE" });
      navigate("/mypage?tab=trip");
    } catch (e) {
      console.error("DELETE /api/mytrip failed", e);
      const msg = e?.response?.data?.message || "삭제에 실패했어요.";
      alert(msg);
    }
  };

  // 레포트 노출 여부 계산 (여행 종료 3일 이후)
  const isReportAvailable = useMemo(() => {
    if (!view?.dateRange) return false;
    const parts = view.dateRange.split("~");
    if (parts.length < 2) return false;
    const end = parts[1].trim().replace(/\./g, "-");
    const [y, m, d] = end.split("-").map((s) => s.trim());
    const endDate = new Date(`${y}-${pad2(m)}-${pad2(d)}`);
    const today = new Date();
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - endDate) / (1000 * 60 * 60 * 24));
    return diffDays > 3;
  }, [view?.dateRange]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setView(null);
      setError("");
      try {
        const res = await api(`/api/mytrip/${id}`);
        const payload = res?.data ?? res?.result ?? res;
        if (!alive) return;

        const mapped = mapDtoToView(payload);
        if (mapped) {
          setView(mapped);
        } else {
          setView(null);
          setRaw(payload);
          setError("응답 포맷을 해석하지 못했어요.");
        }
      } catch (e) {
        if (!alive) return;
        console.error(
          "[Detail] api error:",
          e?.response?.status,
          e?.message,
          e?.response?.data
        );
        setError(
          e?.response?.data?.message || "상세 정보를 불러오지 못했어요."
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    (async () => {
      const res = await getAuthState();
      setUserId(res.user.id);
    })();
  }, []);

  const isOwner = useMemo(() => {
    if (!view?.ownerId || !userId) return false;
    return view.ownerId === userId;
  }, [view?.ownerId, userId]);

  if (loading) {
    return (
      <Wrapper>
        <TripDetail>
          <BackRow>
            <BackBtn url="/mypage?tab=trip" text="내 여행기록 목록" />
          </BackRow>
          <Header>
            <h2>불러오는 중…</h2>
          </Header>
        </TripDetail>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <TripDetail>
          <BackRow>
            <BackBtn url="/mypage?tab=trip" text="내 여행기록 목록" />
          </BackRow>
          <Header>
            <h2 style={{ color: colors.error }}>{error}</h2>
          </Header>
          {raw && (
            <pre
              style={{
                maxHeight: 400,
                overflow: "auto",
                background: "#f7f7f7",
                padding: 16,
                borderRadius: 8,
              }}
            >
              {JSON.stringify(raw, null, 2)}
            </pre>
          )}
        </TripDetail>
      </Wrapper>
    );
  }

  if (!view) {
    return (
      <Wrapper>
        <TripDetail>
          <BackRow>
            <BackBtn url="/mypage?tab=trip" text="내 여행기록 목록" />
          </BackRow>
          <Header>
            <h2>여행 정보를 찾을 수 없습니다.</h2>
          </Header>
          {raw && (
            <pre
              style={{
                maxHeight: 400,
                overflow: "auto",
                background: "#f7f7f7",
                padding: 16,
                borderRadius: 8,
              }}
            >
              {JSON.stringify(raw, null, 2)}
            </pre>
          )}
        </TripDetail>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <TripDetail>
        <BackRow>
          <BackBtn url="/mypage?tab=trip" text="내 여행기록 목록" />
        </BackRow>

        <Header>
          <TripTitle>{view?.title ?? "-"}</TripTitle>
          <Status>{view?.status ?? ""}</Status>
        </Header>

        <TwoCol>
          <Col>
            <Section>
              <BoxSubtitle>사용카드</BoxSubtitle>
              {view?.card ? (
                <CardList
                  thumbnail={undefined}
                  name={`${view.card?.productName ?? "이름 없음"} | ${
                    view.card?.nickname ?? "-"
                  }`}
                  maskedNumber={view.card?.number}
                  linkedAccount={view.card?.account}
                  width="450px"
                  checkGather={!!view.card?.checkGather}
                  hasTrip={true}
                  onHistory={() =>
                    navigate(`/mypage/trip/${view.id}/history`, {
                      state: {
                        card: view.card,
                        budgets: view.budget,
                        total: view.total,
                      },
                    })
                  }
                />
              ) : (
                <EmptyText>연결된 카드가 없습니다.</EmptyText>
              )}
            </Section>

            <Section>
              <BoxSubtitle>여행 정보</BoxSubtitle>
              <InfoGrid>
                <InfoRow>
                  <InfoLabel>기간</InfoLabel>
                  <InfoValue>{view?.dateRange ?? "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>테마</InfoLabel>
                  <InfoValue>
                    <ThemeChip>{view?.theme ?? "-"}</ThemeChip>
                  </InfoValue>
                </InfoRow>
                {view?.groupName && (
                  <InfoRow>
                    <InfoLabel>모임명</InfoLabel>
                    <InfoValue>{view.groupName}</InfoValue>
                  </InfoRow>
                )}
                <InfoRow>
                  <InfoLabel style={{ alignSelf: "flex-start" }}>
                    멤버
                  </InfoLabel>
                  <Members>
                    {(view?.members ?? []).map((m, idx) => (
                      <MemberImg key={idx}>{(m || "?")[0]}</MemberImg>
                    ))}
                  </Members>
                </InfoRow>
              </InfoGrid>
            </Section>
          </Col>

          <Col>
            <Section>
              <BoxSubtitle>여행 예산</BoxSubtitle>
              {(view?.budget ?? []).map((b) => {
                const planned = Number(b.amount || 0);
                const used = Number(b.used || 0);
                const ratio = planned > 0 ? used / planned : 0;
                const clamped = Math.max(0, Math.min(ratio, 1));
                const over = ratio > 1;

                const baseBg = getCategoryColor(b.category);
                const fillBg = over ? getCategoryOverColor(b.category) : baseBg;

                return (
                  <BudgetRow key={b.category}>
                    <InfoLabel>{b.category}</InfoLabel>
                    <Bar>
                      <Fill $ratio={clamped} $bg={fillBg} />
                    </Bar>
                    <BudgetAmount $over={over}>
                      {planned.toLocaleString()}원
                    </BudgetAmount>
                  </BudgetRow>
                );
              })}
            </Section>
          </Col>
        </TwoCol>

        <BtnRow>
          {isOwner ? (
            // 방장인 경우
            <>
              <MediumBtn
                label="삭제"
                bgColor={colors.gray100}
                textColor={colors.error}
                width={160}
                hoverBgColor={colors.gray200}
                onClick={() => setIsDeleteOpen(true)}
              />
              {isReportAvailable ? (
                <MediumBtn
                  label="레포트 보기"
                  bgColor={colors.blue400}
                  textColor={colors.white}
                  width={160}
                  hoverBgColor={colors.blue500}
                  onClick={() => navigate(`/mypage/trip/${view?.id}/report`)}
                />
              ) : (
                <MediumBtn
                  label="수정"
                  bgColor={colors.blue400}
                  textColor={colors.white}
                  width={160}
                  hoverBgColor={colors.blue500}
                  onClick={() => navigate(`/mypage/trip/${view?.id}/edit`)}
                />
              )}
            </>
          ) : (
            // 모임원인 경우
            <MediumBtn
              label="레포트 보기"
              bgColor={colors.blue400}
              textColor={colors.white}
              width={160}
              hoverBgColor={colors.blue500}
              onClick={() => {
                if (isReportAvailable) {
                  navigate(`/mypage/trip/${view?.id}/report`);
                } else {
                  alert("레포트가 아직 생성되지 않았습니다.");
                }
              }}
            />
          )}
        </BtnRow>
        {isDeleteOpen && (
          <Modal
            title="여행을 삭제할까요?"
            def1="삭제하면 되돌릴 수 없어요."
            def2="정말 삭제하시겠어요?"
            type={1}
            btnLabel="취소"
            onClose={() => setIsDeleteOpen(false)}
            func1={() => setIsDeleteOpen(false)}
            func2={handleConfirmDelete}
          />
        )}
      </TripDetail>
    </Wrapper>
  );
}

const BackRow = styled.div`
  align-self: flex-start;
`;

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
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TwoCol = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`;

const Col = styled.div`
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.section`
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BoxSubtitle = styled.div`
  ${fontSet.body2_b};
  color: ${colors.black};
  margin-bottom: 12px;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: flex-end;
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

const InfoLabel = styled.div`
  ${fontSet.body3_m};
  color: ${colors.black};
  width: 70px;
  padding: 0 0 0 20px;
`;

const BudgetAmount = styled.div`
  width: 80px;
  text-align: right;
  color: ${({ $over }) => ($over ? colors.error : colors.black)};
  ${fontSet.detail};
`;

const InfoValue = styled.div`
  ${fontSet.body3_m};
  color: ${colors.black};
  flex: 1;
`;

const ThemeChip = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 5px;
  background: ${colors.blue50};
  color: ${colors.black};
  ${fontSet.body3_m};
`;

const Members = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 70px);
  gap: 10px;
  max-width: 340px;
  align-items: center;
`;

const MemberImg = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${colors.yellow100};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: ${colors.gray800};
`;

const BudgetRow = styled.div`
  display: flex;
  align-items: center;
  width: 450px;
  gap: 10px;
  margin-bottom: 6px;
`;

const Bar = styled.div`
  flex: 1;
  height: 8px;
  background: ${colors.gray200};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const Fill = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $ratio }) => `${$ratio * 100}%`};
  background: ${({ $bg }) => $bg || colors.blue400};
  transition: width 0.35s ease;
`;

const EmptyText = styled.div`
  ${fontSet.body3_m};
  color: ${colors.gray600};
`;

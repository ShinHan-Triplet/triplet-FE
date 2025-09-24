import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import BackBtn from "../../components/button/BackBtn";
import DetailBtn from "../../components/button/DetailBtn";
import MediumBtn from "../../components/button/MediumBtn";
import { api } from "../../lib/api";

import healing1 from "../../assets/img/card/square/healing1.png";
import healing2 from "../../assets/img/card/square/healing2.png";
import healing3 from "../../assets/img/card/square/healing3.png";
import food1    from "../../assets/img/card/square/food1.png";
import food2    from "../../assets/img/card/square/food2.png";
import food3    from "../../assets/img/card/square/food3.png";
import activity1 from "../../assets/img/card/square/activity1.png";
import activity2 from "../../assets/img/card/square/activity2.png";
import activity3 from "../../assets/img/card/square/activity3.png";
import etc1     from "../../assets/img/card/square/etc1.png";
import etc2     from "../../assets/img/card/square/etc2.png";
import etc3     from "../../assets/img/card/square/etc3.png";

const CARD_COVERS = [
  activity1,
  activity2,
  activity3,
  food1,
  food2,
  food3,
  etc1,
  etc2,
  etc3,
  healing1,
  healing2,
  healing3,
];

export default function MyCardDetail(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await api(`/api/mycard/${id}`);
        if (!mounted) return;
        setData(resp);
        setErr("");
      } catch (e) {
        if (!mounted) return;
        console.error("GET /api/mycard/:id failed:", e);
        setErr("카드를 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <Wrapper>
        <CardDetail>
          <BackBtn url="/mypage?tab=card" text="내 카드 목록" />
          <EmptyState>불러오는 중…</EmptyState>
        </CardDetail>
      </Wrapper>
    );
  }

  if (err || !data) {
    return (
      <Wrapper>
        <CardDetail>
          <BackBtn url="/mypage?tab=card" text="내 카드 목록" />
          <EmptyState>{err || "해당 카드를 찾을 수 없습니다."}</EmptyState>
        </CardDetail>
      </Wrapper>
    );
  }

  const coverSrc =
    CARD_COVERS[(Number(data.card_id) - 1 + CARD_COVERS.length) % CARD_COVERS.length] ||
    CARD_COVERS[0];

  const STATUS = Object.freeze({
    1: { text: "사용 중",     color: colors.blue500 },
    2: { text: "일시 정지",   color: colors.error },
    3: { text: "사용 대기 중", color: colors.yellow500 },
  });

  const codeRaw = data.cardStatus ?? data.status ?? 1;
  const code = Number.isFinite(Number(codeRaw)) ? Number(codeRaw) : 1;

  const statusMeta = STATUS[code] || STATUS[1];
  const statusText = statusMeta.text;
  const statusColor = statusMeta.color;

  const isWaiting = code === 3;
  const isPaused  = code === 2;
  const reportLabel = isPaused ? "정지 해제" : "분실 신고";

  const handleReport = () => {
    if (isWaiting) return;
    if (isPaused) console.log("정지 해제");
    else console.log("분실 신고");
  };

  return (
    <Wrapper>
      <CardDetail>
        <BackBtn url="/mypage?tab=card" text="내 카드 목록" />

        <DetailGrid>
          <CardImg>
             <img src={coverSrc} alt="카드 이미지" />
          </CardImg>
          <Right>
            <Status style={{ color: statusColor }}>{statusText}</Status>
            <HeaderRow>
              <TitleWrap>
                <Title>{data.name}</Title>
                <Divider>|</Divider>
                <Nickname>{data.nickname}</Nickname>
              </TitleWrap>
            </HeaderRow>
            <DetailBtn url={`/mypage/card/${data.mcard_id}/history`} text="카드내역 보기" />

            <DetailRow>
            <Section>
              <SectionTitle>주요 혜택</SectionTitle>
              <BenefitList>
                 {(data.benefits || []).map((b, i) => (
                    <BenefitItem key={i}>
                      <BenefitTitle>{b.title}</BenefitTitle>
                      {b.content && <BenefitContent>{b.content}</BenefitContent>}
                    </BenefitItem>
                  ))}
                </BenefitList>
            </Section>
            </DetailRow>
          </Right>
        </DetailGrid>

        <ActionRow>
          <DisableWrap disabled={isWaiting}>
            <MediumBtn
              label={reportLabel}
              onClick={isWaiting ? undefined : handleReport}
              bgColor={colors.gray100}
              textColor={isWaiting ? colors.gray400 : colors.gray800}
              width={160}
              hoverBgColor={colors.gray200}
            />
          </DisableWrap>
          <MediumBtn
            label="카드 삭제"
            onClick={() => console.log("카드 삭제")}
            bgColor={colors.gray100}
            textColor={colors.error}
            width={160}
            hoverBgColor={colors.gray200}
          />
        </ActionRow>
      </CardDetail>
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

const CardDetail = styled(CardBase)`
  padding: 30px 70px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  padding: 0 20px;
  gap: 20px;
  align-items: center;
`;

const CardImg = styled.div`
  width: 340px;
  height: 340px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;   /* 중요! */
    border-radius: 12px; /* 선택 */
    display: block;
  }
`;

const Right = styled.div`
  width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Status = styled.div`
  ${fontSet.body2_b};
`;

const Title = styled.h2`
  margin: 0;
  ${fontSet.heading2};
  color: ${colors.black};
`;

const Divider = styled.span`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Nickname = styled.span`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 52px;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  ${fontSet.body2_b};
  color: ${colors.black};
`;

const BenefitList = styled.ul`
  margin: 0;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  line-height: 1.6;
`;

const BenefitTitle = styled.span`
  ${fontSet.body3_m};
  color: ${colors.gray800};
`;

const BenefitContent = styled.span`
  ${fontSet.detail};
  color: ${colors.gray600};
`;

// const PwdRow = styled.div`
//   display: flex;
//   padding-left: 10px;
//   gap: 10px;
//   align-items: center;
// `;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 40px;
`;

const DisableWrap = styled.div`
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const EmptyState = styled.div`
  padding: 40px 0 20px;
  color: ${colors.gray700};
`;
import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import shadows from "../../styles/shadows";
import BackBtn from "../../components/button/BackBtn";
import DetailBtn from "../../components/button/DetailBtn";
// import SmallBtn from "../../components/button/SmallBtn";
import MediumBtn from "../../components/button/MediumBtn";
// import InputBox from "../../components/input/InputBox";
import defaultThumb from "../../assets/img/test_thumbnail.png";

import { useParams } from "react-router-dom";

const thumbnailUrl = defaultThumb;
const cards = [
  {
    id: 1,
    thumbnail: thumbnailUrl,
    name: "HJW BABO 체크",
    nickname: "카드 별칭띠예",
    status: "active",
    maskedNumber: "1234-56**-****-5678",
    linkedAccount: "111-234-5678",
    card_pw: 1234
  },
  {
    id: 2,
    thumbnail: thumbnailUrl,
    name: "MUKJJANG 체크",
    nickname: "쩝쩝박사",
    status: "waiting",
    maskedNumber: "6666-58**-****-7070",
    linkedAccount: "777-654-9999",
    card_pw: 9876
  },
  {
    id: 3,
    thumbnail: thumbnailUrl,
    name: "UP&DOWN 체크",
    nickname: "다운카드",
    status: "paused",
    maskedNumber: "0202-12**-****-9876",
    linkedAccount: "987-654-3210",
    card_pw: 2468
  },
];

const benefits = [
  { title: "일반 음식점 결제 10% 캐시백", content: "(월 최대 30,000원)" },
  { title: "카페·베이커리 5% 적립", content: "(스타벅스, 이디야 등)" },
  { title: "편의점 결제 5% 캐시백", content: "(CU, GS25, 세븐일레븐)" },
  { title: "해외 결제 수수료 0% + 3% 추가 적립", content: "" },
];

export default function MyCardDetail(){
  const { id } = useParams();
  const card = cards.find((c) => String(c.id) === String(id));

  if (!card) {
    return (
      <Wrapper>
        <CardDetail>
          <BackBtn url="/mypage?tab=card" text="내 카드 목록" />
          <EmptyState>해당 카드를 찾을 수 없습니다.</EmptyState>
        </CardDetail>
      </Wrapper>
    );
  }

  const statusText =
    card.status === "paused"
      ? "일시 정지"
      : card.status === "waiting"
      ? "사용 대기 중"
      : "사용 중";

  const statusColor =
    card.status === "paused"
      ? colors.error
      : card.status === "waiting"
      ? colors.yellow500
      : colors.blue500;

  const isWaiting = card.status === "waiting";
  const isPaused  = card.status === "paused";
  const reportLabel = isPaused ? "정지 해제" : "분실 신고";

const handleReport = () => {
  if (isWaiting) return;
  if (isPaused) {
    console.log("정지 해제");
  } else {
    console.log("분실 신고");
  }
};

  return (
    <Wrapper>
      <CardDetail>
        <BackBtn url="/mypage?tab=card" text="내 카드 목록" />

        <DetailGrid>
          <CardImg>
            <img src={card.thumbnail} alt="카드 이미지" />
          </CardImg>
          <Right>
            <Status style={{ color: statusColor }}>{statusText}</Status>
            <HeaderRow>
              <TitleWrap>
                <Title>{card.name}</Title>
                <Divider>|</Divider>
                <Nickname>{card.nickname}</Nickname>
              </TitleWrap>
            </HeaderRow>
            <DetailBtn url={`/mypage/card/${card.id}/history`} text="카드내역 보기" />

            <DetailRow>
            <Section>
              <SectionTitle>주요 혜택</SectionTitle>
              <BenefitList>
                {benefits.map((b, i) => (
                  <BenefitItem key={i}>
                    <BenefitTitle>{b.title}</BenefitTitle>
                    {b.content && <BenefitContent>{b.content}</BenefitContent>}
                  </BenefitItem>
                ))}
              </BenefitList>
            </Section>

            {/* <Section>
              <SectionTitle>비밀번호 수정</SectionTitle>
              <PwdRow>
                <InputBox
                  placeholder="***********"
                  width={380}
                />
                <SmallBtn
                  label="수정"
                  onClick={() => console.log("비밀번호 수정")}
                  bgColor={colors.blue400}
                  textColor={colors.white}
                  width={120}
                />
              </PwdRow>
            </Section> */}
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
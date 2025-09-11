import styled, { keyframes } from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import InputBox from "../../components/input/InputBox";
import MediumBtn from "../../components/button/MediumBtn";
import BackBtn from "../../components/button/BackBtn";
import LargeBtn from "../../components/button/LargeBtn";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useRef, useEffect } from "react";
// (권장) 공용 카드 데이터가 있으면 import 해서 fallback에 활용
// import { CARD_DATA } from "../../data/cards"; // 공용 모듈로 빼뒀다면

// 입장 애니메이션
const popIn = keyframes`
  0% { opacity: 0; transform: translateY(12px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

// 대기 플로팅
const bob = keyframes`
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

// 샤인 스윕
const shine = keyframes`
  from { transform: translateX(-120%) skewX(-20deg); }
  to   { transform: translateX(220%)  skewX(-20deg); }
`;

// 래퍼: 입장, 대기 플로팅, 샤인 오버레이까지 담당
const CardImgWrap = styled.div`
  position: relative;
  width: 215px;
  height: 340px;
  perspective: 900px;
  transform-style: preserve-3d;

  animation: ${popIn} 420ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${popIn} 420ms cubic-bezier(0.22, 1, 0.36, 1) both,
      ${bob} 4.8s ease-in-out infinite 600ms;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 100%
    );
    transform: translateX(-120%) skewX(-20deg);
    opacity: 0;
  }

  &[data-hovered="true"]::after {
    opacity: 1;
    animation: ${shine} 900ms ease 0ms 1;
  }
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;

  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
  transition: transform 120ms ease, filter 200ms ease, box-shadow 200ms ease;

  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);

  ${CardImgWrap}[data-hovered="true"] & {
    transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0)
      translateY(-2px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);
    filter: brightness(1.02);
  }
`;

export default function NewCard() {
  const location = useLocation();
  const { id: idFromParam } = useParams(); // /card/:id/apply 의 :id
  const navigate = useNavigate();
  const { state } = useLocation();
  const prevUrl = state?.prevUrl || "/card";

  // 1) 라우터 state로 온 카드(가장 우선)
  const cardFromState = location.state?.card;

  // 2) 세션스토리지에 저장해둔 id (새로고침/딥링크 대비)
  const idFromStorage = sessionStorage.getItem("triplet:selectedCardId");

  // 3) 최종적으로 사용할 id
  const effectiveId = cardFromState?.id ?? idFromParam ?? idFromStorage ?? null;

  // 4) 카드 객체 복원
  const card = useMemo(() => {
    if (cardFromState) return cardFromState; // 가장 빠름
    if (!effectiveId) return null;

    // (A) 프론트에 CARD_DATA가 있으면 여기서 찾아도 됨
    // return CARD_DATA.find(c => c.id === effectiveId) ?? null;

    // (B) 서버에서 불러오는 구조라면 fetch 사용(예시)
    // 이 경우엔 useEffect로 비동기 호출하면 돼요.
    return null;
  }, [cardFromState, effectiveId]);

  // (B) 서버 호출 예시 (원한다면)
  // useEffect(() => {
  //   if (!card && effectiveId) {
  //     fetch(`/api/cards/${effectiveId}`)
  //       .then(res => res.json())
  //       .then(data => setCard(data))
  //       .catch(() => {/* 에러 처리 */});
  //   }
  // }, [card, effectiveId]);

  if (!effectiveId) {
    return (
      <div style={{ padding: 24 }}>
        선택한 카드를 찾을 수 없어요.
        <button onClick={() => navigate(-1)} style={{ marginLeft: 12 }}>
          뒤로가기
        </button>
      </div>
    );
  }

  if (!card) {
    // CARD_DATA를 안 쓰고 서버 호출을 기다릴 때 보여줄 로딩 상태
    return <div style={{ padding: 24 }}>카드 정보를 불러오는 중...</div>;
  }

  function CardPreview({ src, alt = "" }) {
    // const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
    const wrapRef = useRef(null);
    const rectRef = useRef(null);
    const rafRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    const setVars = (rx, ry) => {
      const el = wrapRef.current;
      if (!el) return;
      el.style.setProperty("--rx", rx + "deg");
      el.style.setProperty("--ry", ry + "deg");
    };

    const measure = () => {
      if (wrapRef.current)
        rectRef.current = wrapRef.current.getBoundingClientRect();
    };

    const reset = () => {
      setVars(0, 0);
      rectRef.current = null;
      setHovered(false);
    };

    const onEnter = () => {
      measure();
      setHovered(true);
    };

    const onMove = (e) => {
      if (!rectRef.current) measure();
      const r = rectRef.current;
      const px = (e.clientX - r.left) / r.width; // 0~1
      const py = (e.clientY - r.top) / r.height; // 0~1

      const max = 10; // 최대 기울기 각도
      const ry = (px - 0.5) * (max * 2); // 좌우 회전
      const rx = -(py - 0.5) * (max * 2); // 상하 회전

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setVars(rx, ry);
          rafRef.current = 0;
        });
      }
    };

    useEffect(() => {
      const onResize = reset;
      const onScroll = reset;
      const onVisibility = () => document.hidden && reset();

      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onScroll, true);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll, true);
        document.removeEventListener("visibilitychange", onVisibility);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <CardImgWrap
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={reset}
        data-hovered={hovered || undefined}
        onMouseOut={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) reset();
        }}
      >
        <CardImg src={src} alt={alt} />
      </CardImgWrap>
    );
  }

  return (
    <>
      <Container>
        <Title>
          <BackBtn url={prevUrl} text="이전" />
          <SubTitle>카드신청</SubTitle>
          <MainTitle>{card.name}</MainTitle>
        </Title>

        <CardContainer>
          <CardPreview src={card.image} alt={card.name} />
          <CardInfo>
            <CardTitle>주요 혜택</CardTitle>
            <BenefitList>
              {card.benefits.map((b, i) => (
                <Benefit key={i}>
                  <BenefitTitle>{b.title}</BenefitTitle>
                  <BenefitContent>{b.content}</BenefitContent>
                </Benefit>
              ))}
            </BenefitList>
          </CardInfo>
        </CardContainer>

        <CardDetail>
          <DetailSubTitle>카드정보 작성</DetailSubTitle>
          <Fill>
            <BlueTitle>신청인 정보 작성</BlueTitle>
            <Contents>
              <Detail>
                <DetailTitle>이름</DetailTitle>
                <InputBox
                  placeholder="이름을 입력해주세요"
                  width={520}
                ></InputBox>
              </Detail>

              <Detail>
                <DetailTitle>휴대폰번호</DetailTitle>
                <InputBox
                  placeholder="‘-’를 제외하고 입력해주세요"
                  width={520}
                ></InputBox>
              </Detail>

              <Detail>
                <DetailTitle>주민등록번호</DetailTitle>
                <Input>
                  <InputBox placeholder="000000" width={250}></InputBox>
                  <Hyphen>-</Hyphen>
                  <InputBox placeholder="000000" width={250}></InputBox>
                </Input>
              </Detail>

              <Detail>
                <DetailTitle>자택주소</DetailTitle>
                <DetailAddress>
                  <Photo>
                    <InputBox
                      placeholder="파일을 선택해주세요"
                      width={340}
                    ></InputBox>
                    <MediumBtn
                      label="파일선택"
                      bgColor={colors.blue400}
                      textColor={colors.white}
                      width={160}
                    ></MediumBtn>
                  </Photo>
                  <InputBox
                    placeholder="‘-’를 제외하고 입력해주세요"
                    width={520}
                  ></InputBox>
                </DetailAddress>
              </Detail>
            </Contents>
          </Fill>

          <Fill>
            <BlueTitle>연결 계좌</BlueTitle>
            <Contents>
              <Detail>
                <DetailTitle>계좌번호</DetailTitle>
                <InputBox
                  placeholder="연결할 계좌번호를 입력해주세요"
                  width={520}
                ></InputBox>
              </Detail>
            </Contents>
          </Fill>

          <Fill>
            <BlueTitle>카드 비밀번호</BlueTitle>
            <Contents>
              <Detail>
                <DetailTitle>비밀번호</DetailTitle>
                <InputBox
                  placeholder="4자리 숫자를 입력해주세요"
                  width={520}
                ></InputBox>
              </Detail>
              <Detail>
                <DetailTitle>비밀번호 확인</DetailTitle>
                <InputBox
                  placeholder="비밀번호를 다시 입력해주세요"
                  width={520}
                ></InputBox>
              </Detail>
            </Contents>
          </Fill>

          <Fill>
            <BlueTitle>카드 별명 설정</BlueTitle>
            <Contents>
              <Detail>
                <DetailTitle>카드 별명</DetailTitle>
                <InputBox
                  placeholder="카드 별명을 입력해주주세요"
                  width={520}
                ></InputBox>
              </Detail>
            </Contents>
          </Fill>
        </CardDetail>

        <BtnSpace>
          <LargeBtn
            label="다음"
            // onClick={nextPage}
            bgColor={colors.blue400}
            textColor={colors.white}
            width={180}
          ></LargeBtn>
        </BtnSpace>
      </Container>
    </>
  );
}

const CardDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-left: 90px;
`;

const Fill = styled.div`
  width: 880px;
  margin-left: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
`;

const BlueTitle = styled.div`
  ${fontSet.heading3}
  color: ${colors.blue500};
  margin-bottom: 24px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
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

const Photo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 70px;
  margin-top: 170px;
`;
const CardTitle = styled.div`
  ${fontSet.body2_b}
  display: flex;
  width: 367px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 22px;
`;
const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  // margin-bottom: 92px;
  margin-left: 90px;
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

const Benefit = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  width: 367px;
`;
const BenefitTitle = styled.div`
  ${fontSet.body3_m}
  color: ${colors.black};
`;
const BenefitContent = styled.div`
  ${fontSet.detail}
  color: ${colors.gray600};
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const MainTitle = styled.div`
  ${fontSet.heading1}
`;

const SubTitle = styled.div`
  ${fontSet.heading2}
`;

const DetailSubTitle = styled.div`
  ${fontSet.heading2}
`;

const Hyphen = styled.div`
  ${fontSet.body1_m}
  width: 20px;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px;
`;

const DetailAddress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BtnSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

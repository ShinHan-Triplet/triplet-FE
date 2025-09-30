import styled, { keyframes } from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import InputBox from "../../components/input/InputBox";
import MediumBtn from "../../components/button/MediumBtn";
import BackBtn from "../../components/button/BackBtn";
import LargeBtn from "../../components/button/LargeBtn";
import DaumPostcode from "react-daum-postcode";
import Modal from "../../components/modal/Modal";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { api, ensureAccessToken } from "../../lib/api";
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
  border-radius: 10px;

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

const CardPreview = React.memo(function CardPreview({ src, alt = "" }) {
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
});

export default function NewCard() {
  const location = useLocation();
  const { id: idFromParam } = useParams(); // /card/:id/apply 의 :id
  const navigate = useNavigate();
  const { state } = useLocation();
  const prev2Url = state?.prev2Url || "/card";
  const prevUrl = state?.prevUrl || "/trip";
  const soloTrip = state?.soloTrip || false;
  const checkGather = state?.checkGather || false;
  const gatherName = state?.gatherName || "";
  const [postcodeOpen, setPostcodeOpen] = useState(false);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [nickname, setNickname] = useState("");
  const [addr, setAddr] = useState({
    postcode: "",
    address: "",
    detail: "",
    extra: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const detailRef = useRef(null);
  const bindAddr = (key) => (e) => {
    const v = typeof e === "object" && e?.target ? e.target.value : e ?? "";
    setAddr((a) => ({ ...a, [key]: v }));
  };

  const digits = (s) => (s || "").replace(/\D/g, "");

  function validateForm() {
    const missing = [];

    if (!name.trim()) missing.push("이름");

    const phoneDigits = digits(phone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      missing.push("휴대폰번호(10~11자리)");
    }

    if (rrn1.length !== 6 || rrn2.length !== 7) {
      missing.push("주민등록번호(앞 6자리·뒤 7자리)");
    }

    if (!addr.postcode.trim()) missing.push("우편번호");
    if (!addr.address.trim()) missing.push("주소");

    if (digits(account).length < 1) missing.push("계좌번호");

    if (pw1.length !== 4) missing.push("카드 비밀번호(4자리)");
    if (pw2.length !== 4) missing.push("카드 비밀번호 확인(4자리)");
    if (pw1 && pw2 && pw1 !== pw2) {
      missing.push("비밀번호가 서로 일치하도록 다시 입력");
    }

    if (!nickname.trim()) missing.push("카드 별명");

    return missing;
  }

  const handleAccount = (e) =>
    setAccount(onlyDigits(e.target.value).slice(0, 20));
  const handlePostcodeComplete = (data) => {
    // 도로명/지번 분기
    const address =
      data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

    // 참고항목 조합
    let extraAddr = "";
    if (data.userSelectedType === "R") {
      if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
        extraAddr += data.bname;
      }
      if (data.buildingName !== "" && data.apartment === "Y") {
        extraAddr +=
          extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      if (extraAddr !== "") extraAddr = ` (${extraAddr})`;
    }

    setAddr((prev) => ({
      ...prev,
      postcode: data.zonecode,
      address,
      extra: extraAddr,
    }));

    setPostcodeOpen(false);
    // InputBox가 forwardRef면 바로 포커스; 아니면 살짝 지연
    requestAnimationFrame(() => detailRef.current?.focus());
  };

  // 숫자만 남기기
  const onlyDigits = (s) => (s || "").replace(/\D/g, "");

  // 한국형 전화번호 포맷팅 (모바일/일반 대응)
  const formatPhoneKR = (digits) => {
    const d = onlyDigits(digits);

    // 02 시작(서울) 처리
    if (d.startsWith("02")) {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
      if (d.length <= 9)
        return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
      return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
    }

    // 그 외(010 등)
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    if (d.length <= 10)
      return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
  };

  // 상태들
  const [phone, setPhone] = useState("");
  const handlePhoneChange = (e) => {
    const d = onlyDigits(e.target.value).slice(0, 11); // 휴대폰 최대 11자리
    setPhone(formatPhoneKR(d));
  };

  const [rrn1, setRrn1] = useState(""); // 주민등록번호 앞 6
  const [rrn2, setRrn2] = useState(""); // 주민등록번호 뒤 7 (마스킹)
  const handleRrn1 = (e) => setRrn1(onlyDigits(e.target.value).slice(0, 6));
  const handleRrn2 = (e) => setRrn2(onlyDigits(e.target.value).slice(0, 7));

  const [pw1, setPw1] = useState(""); // 카드 비밀번호 4자리
  const [pw2, setPw2] = useState("");
  const handlePw1 = (e) => setPw1(onlyDigits(e.target.value).slice(0, 4));
  const handlePw2 = (e) => setPw2(onlyDigits(e.target.value).slice(0, 4));
  const pwMismatch = pw1.length > 0 && pw2.length > 0 && pw1 !== pw2;

  const gotoHome = () => {
    navigate("/");
  };
  const gotoMypage = () => {
    navigate("/mypage?tab=card");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const newGather = () => {
    setIsModalOpen(true);
  };

  const cardFromState = location.state?.card;

  const idFromStorage = sessionStorage.getItem("triplet:selectedCardId");

  const effectiveId = cardFromState?.id ?? idFromParam ?? idFromStorage ?? null;

  const card = useMemo(() => {
    if (cardFromState) return cardFromState;
    if (!effectiveId) return null;
    return null;
  }, [cardFromState, effectiveId]);

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

  function PostcodeModal({ onClose, onComplete }) {
    const [closing, setClosing] = useState(false);
    const handleClose = () => setClosing(true);

    return (
      <Overlay data-state={closing ? "closing" : "open"} onClick={handleClose}>
        <Sheet
          data-state={closing ? "closing" : "open"}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={(e) => {
            // content 애니메이션이 끝났을 때만 진짜 닫기
            if (closing && e.currentTarget === e.target) onClose();
          }}
        >
          <DaumPostcode
            onComplete={(data) => {
              onComplete(data); // 부모에서 상태 채우고 포커스 이동
              handleClose(); // 닫힘 애니메이션 시작
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </Sheet>
      </Overlay>
    );
  }

  const buildAddress = ({ postcode, address, detail, extra }) => {
    const parts = [];
    if (postcode) parts.push(`(${postcode})`);
    if (address) parts.push(address);
    if (extra) parts.push(extra);
    if (detail) parts.push(detail);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  };

  const buildRRN = ({ rrn1, rrn2 }) => {
    const parts = [];
    if (rrn1) parts.push(rrn1);
    if (rrn2) parts.push(rrn2);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  };

  const handleApply = async () => {
    const missing = validateForm();
    if (missing.length) {
      alert(`${missing.join(", ")}를(을) 작성해주세요.`);
      return;
    }
    const fullAddress = buildAddress(addr);
    const fullRRN = buildRRN({ rrn1, rrn2 });

    const payload = {
      cardId: effectiveId,
      name: name,
      phone: phone,
      memberNum: fullRRN, // 서버에서 저장 X (검증용 사용 후 폐기 권장)
      address: fullAddress,
      account: account,
      pw: pw1, // 서버 저장 금지(암호화/해시 사용 또는 미저장)
      nickName: nickname,
      checkGather: checkGather,
    };

    //모임카드인 경우
    try {
      await ensureAccessToken(window.location);
      const result = await api(`/api/card/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      var newCardId;
      if (typeof result === "number") {
        newCardId = result;
      } else if (typeof result === "string") {
        const n = Number(result);
        newCardId = Number.isFinite(n) ? n : null;
      }

      if (checkGather) {
        await ensureAccessToken(window.location);
        await api(`/api/trips/from-draft`, {
          method: "POST",
          body: JSON.stringify({
            newGather: {
              name: gatherName || "새 모임",
              mcardId: newCardId,
            },
          }),
        });
      }
      setIsModalOpen(true); // 기존 모달 사용
    } catch (e) {
      alert("카드 발급에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          title="새로운 카드를 만들었어요"
          def1="새 카드로 준비 끝, 출발만 남았어요"
          def2="마이페이지에서 사용 내역을 확인할 수 있어요"
          type={1}
          onClose={closeModal}
          func1={gotoHome}
          func2={gotoMypage}
        />
      )}
      <Container>
        <Title>
          <BackBtn url={prev2Url} text="이전" state={{ soloTrip, prevUrl }} />
          <SubTitle>카드신청</SubTitle>
        </Title>

        <CardContainer>
          <CardPreview src={card.image} alt={card.name} />
          <CardInfo>
            <MainTitle>{card.name}</MainTitle>
            <div>
              <CardTitle>주요 혜택</CardTitle>
              <BenefitList>
                {card.benefits.map((b, i) => (
                  <Benefit key={i}>
                    <BenefitTitle>{b.title}</BenefitTitle>
                    <BenefitContent>{b.content}</BenefitContent>
                  </Benefit>
                ))}
              </BenefitList>
            </div>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></InputBox>
              </Detail>

              <Detail>
                <DetailTitle>휴대폰번호</DetailTitle>
                <InputBox
                  placeholder="‘-’를 제외하고 입력해주세요"
                  value={phone}
                  onChange={handlePhoneChange}
                  type="tel"
                  inputMode="numeric"
                  maxLength={13}
                  width={520}
                ></InputBox>
              </Detail>

              <Detail>
                <DetailTitle>주민등록번호</DetailTitle>
                <Input>
                  <InputBox
                    placeholder="000000"
                    width={250}
                    value={rrn1}
                    onChange={handleRrn1}
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="off"
                  ></InputBox>
                  <Hyphen>-</Hyphen>
                  <InputBox
                    placeholder="000000"
                    width={250}
                    value={rrn2}
                    onChange={handleRrn2}
                    type="password"
                    inputMode="numeric"
                    maxLength={7}
                    autoComplete="off"
                  ></InputBox>
                </Input>
              </Detail>

              <Detail>
                <DetailTitle>자택주소</DetailTitle>
                <DetailAddress>
                  <Photo>
                    <InputBox
                      id="sample6_postcode"
                      placeholder="우편번호"
                      width={340}
                      value={addr.postcode}
                      onChange={bindAddr("postcode")}
                    ></InputBox>
                    <MediumBtn
                      label="우편번호 찾기"
                      bgColor={colors.blue400}
                      textColor={colors.white}
                      width={160}
                      onClick={() => setPostcodeOpen(true)}
                    ></MediumBtn>
                  </Photo>
                  <InputBox
                    id="sample6_address"
                    placeholder="주소"
                    width={520}
                    value={addr.address}
                    onChange={bindAddr("address")}
                  ></InputBox>
                  <Photo>
                    <InputBox
                      id="sample6_detailAddress"
                      placeholder="상세주소"
                      width={200}
                      value={addr.detail}
                      onChange={bindAddr("detail")}
                      ref={detailRef}
                    ></InputBox>
                    <InputBox
                      id="sample6_extraAddress"
                      placeholder="참고항목"
                      width={300}
                      value={addr.extra}
                      onChange={bindAddr("extra")}
                    ></InputBox>
                  </Photo>
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
                  value={account}
                  onChange={handleAccount}
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
                  value={pw1}
                  onChange={handlePw1}
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="new-password"
                ></InputBox>
              </Detail>
              <CheckPwd>
                <Detail>
                  <DetailTitle>비밀번호 확인</DetailTitle>
                  <InputBox
                    placeholder="비밀번호를 다시 입력해주세요"
                    width={520}
                    value={pw2}
                    onChange={handlePw2}
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="new-password"
                    aria-invalid={pwMismatch ? "true" : "false"}
                  ></InputBox>
                </Detail>
                {pwMismatch && (
                  <ErrorText role="alert">
                    비밀번호가 일치하지 않습니다
                  </ErrorText>
                )}
              </CheckPwd>
            </Contents>
          </Fill>

          <Fill>
            <BlueTitle>카드 별명 설정</BlueTitle>
            <Contents>
              <Detail>
                <DetailTitle>카드 별명</DetailTitle>
                <InputBox
                  placeholder="카드 별명을 입력해주세요"
                  width={520}
                  maxLength={15}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                ></InputBox>
              </Detail>
            </Contents>
          </Fill>
        </CardDetail>

        <BtnSpace>
          <LargeBtn
            label="카드 발급완료"
            onClick={handleApply}
            bgColor={colors.blue400}
            textColor={colors.white}
            width={220}
          ></LargeBtn>
        </BtnSpace>
      </Container>
      {postcodeOpen && (
        <PostcodeModal
          onClose={() => setPostcodeOpen(false)}
          onComplete={handlePostcodeComplete}
        />
      )}
    </>
  );
}

const CheckPwd = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const ErrorText = styled.div`
  ${fontSet.detail}
  color: ${colors.error};
  margin-left: 184px;
  margin-top: -8px;
`;

const overlayShow = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const contentShowUpVH = keyframes`
  from { opacity: 0; transform: translateY(8vh); }
  to   { opacity: 1; transform: translateY(0); }
`;
const overlayHide = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;
const contentHideDown = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(8vh); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  &[data-state="open"] {
    animation: ${overlayShow} 180ms ease-out forwards;
  }
  &[data-state="closing"] {
    animation: ${overlayHide} 180ms ease-out forwards;
  }
`;

const Sheet = styled.div`
  width: 520px;
  height: 520px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  position: relative;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  &[data-state="open"] {
    animation: ${contentShowUpVH} 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  &[data-state="closing"] {
    animation: ${contentHideDown} 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

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
  height: 340px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 90px;
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
  width: 500px;
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
  display: flex;
  width: 500px;
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
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

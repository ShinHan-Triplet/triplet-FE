import React from "react";
import styled from "styled-components";

export default function CardRotator({
  images, // [mudo1, mudo2, mudo3]
  index,
  interval = 4000, // 한 장 유지 시간(ms)
  fade = 600, // 페이드 시간(ms)
  className,
}) {
  const [active, setActive] = React.useState(0); // 0 또는 1 (보이는 레이어)
  const [srcA, setSrcA] = React.useState(images?.[0] ?? "");
  const [srcB, setSrcB] = React.useState(images?.[1] ?? images?.[0] ?? "");
  const shownIndexRef = React.useRef(0);

  // 이미지 프리로드
  React.useEffect(() => {
    images?.forEach((s) => {
      const i = new Image();
      i.src = s;
    });
  }, [images]);

  // 로테이션
  React.useEffect(() => {
    if (index == null || !images?.length) return;
    const safeIdx = ((index % images.length) + images.length) % images.length;
    const nextSrc = images[safeIdx];

    // 이미 화면에 보이는 소스와 같으면 스킵
    const currentSrc = active === 0 ? srcA : srcB;
    if (currentSrc === nextSrc) {
      shownIndexRef.current = safeIdx;
      return;
    }

    if (active === 0) {
      setSrcB(nextSrc);
      setActive(1);
    } else {
      setSrcA(nextSrc);
      setActive(0);
    }
    shownIndexRef.current = safeIdx;
  }, [index, images, fade]);

  // Uncontrolled: index가 없을 때만 내부 타이머로 순환
  React.useEffect(() => {
    if (index != null || !images?.length) return;
    const id = setInterval(() => {
      const next = (shownIndexRef.current + 1) % images.length;
      const nextSrc = images[next];
      if (active === 0) {
        setSrcB(nextSrc);
        setActive(1);
      } else {
        setSrcA(nextSrc);
        setActive(0);
      }
      shownIndexRef.current = next;
    }, interval);
    return () => clearInterval(id);
  }, [images, interval, index, active]);

  return (
    <Frame className={className}>
      <Layer $src={srcA} $fade={fade} $visible={active === 0} />
      <Layer $src={srcB} $fade={fade} $visible={active === 1} />
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  width: 667px;
  height: 369px;
  overflow: hidden;
`;

const Layer = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.$src});
  background-size: cover;
  background-position: center;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity ${(p) => p.$fade}ms ease;
  will-change: opacity;
`;

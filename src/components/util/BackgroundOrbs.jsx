import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

export default function BackgroundOrbs({ orbs = [], once = true }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const el = ref.current;
    let raf1 = 0, raf2 = 0;

    const setInNextFrame = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setInView(true));
      });
    };

    const isInViewNow = () => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    if (isInViewNow()) setInNextFrame();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInNextFrame();
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    if (el) io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [once]);

  return (
    <Wrap ref={ref} aria-hidden>
      {orbs.map((o, i) => (
        <Orb
          key={i}
          className={inView ? 'in' : ''}
          $x={o.x}
          $y={o.y}
          $size={o.size}
          $blur={o.blur ?? 60}
          $color={o.color}
          $dir={o.dir ?? 'up'}
          style={{ animationDelay: `${o.delay ?? 0}s` }}
        />
      ))}
    </Wrap>
  );
}

const flyFromUp = keyframes`
  from { transform: translate3d(0,-22%,0) scale(.92); opacity: 0; }
  to   { transform: translate3d(0,0,0)  scale(1);    opacity: 1; }
`;
const flyFromDown = keyframes`
  from { transform: translate3d(0,22%,0) scale(.92); opacity: 0; }
  to   { transform: translate3d(0,0,0)  scale(1);    opacity: 1; }
`;
const flyFromLeft = keyframes`
  from { transform: translate3d(-22%,0,0) scale(.92); opacity: 0; }
  to   { transform: translate3d(0,0,0)    scale(1);   opacity: 1; }
`;
const flyFromRight = keyframes`
  from { transform: translate3d(22%,0,0) scale(.92); opacity: 0; }
  to   { transform: translate3d(0,0,0)   scale(1);   opacity: 1; }
`;

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
`;

const Orb = styled.div`
  position: absolute;
  left: ${({ $x }) => $x ?? '0'};
  top: ${({ $y }) => $y ?? '0'};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 9999px;

  background: radial-gradient(closest-side, ${({ $color }) => $color} 0%, transparent 70%);
  filter: blur(${({ $blur }) => $blur}px);
  opacity: 0;
  transform: translate3d(0,0,0) scale(.98);

  &.in {
    opacity: 1;
    animation: ${({ $dir }) =>
      $dir === 'left'  ? flyFromLeft  :
      $dir === 'right' ? flyFromRight :
      $dir === 'down'  ? flyFromDown  :
                         flyFromUp} 900ms cubic-bezier(.2,.65,.2,1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
`;

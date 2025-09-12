import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function Reveal({ children, dir = 'up', delay = 0, once = true }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReduced) {
      setMounted(true);
      setVisible(true);
      return;
    }

    let raf1 = 0, raf2 = 0, raf3 = 0;
    const el = ref.current;

    raf1 = requestAnimationFrame(() => setMounted(true));

    const isInViewNow = () => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    if (isInViewNow()) {
      raf2 = requestAnimationFrame(() => {
        raf3 = requestAnimationFrame(() => setVisible(true));
      });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    if (el) io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
    };
  }, [once]);

  return (
    <Wrap
      ref={ref}
      $dir={dir}
      $mounted={mounted}
      $visible={visible}
      style={{ transitionDelay: `${delay}s` }}
      aria-hidden={!visible}
    >
      {children}
    </Wrap>
  );
}

const OFFSETS = {
  up: 'translate3d(0, 24px, 0)',
  down: 'translate3d(0, -24px, 0)',
  left: 'translate3d(24px, 0, 0)',
  right: 'translate3d(-24px, 0, 0)',
};

const Wrap = styled.div`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible, $dir }) => ($visible ? 'none' : OFFSETS[$dir] || OFFSETS.up)};
  transition: ${({ $mounted }) => ($mounted ? 'opacity 560ms ease, transform 560ms ease' : 'none')};
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
`;

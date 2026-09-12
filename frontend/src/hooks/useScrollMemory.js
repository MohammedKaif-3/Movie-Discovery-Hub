import { useEffect } from 'react';

export const useScrollMemory = ({ activeRoute, getScrollPosition, saveScrollPosition }) => {
  useEffect(() => {
    const route = activeRoute;
    const latestTop = { current: getScrollPosition(route) };
    const frame = { current: 0 };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        latestTop.current = window.scrollY;
        frame.current = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
      saveScrollPosition(route, latestTop.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [activeRoute, getScrollPosition, saveScrollPosition]);
};

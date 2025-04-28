import { useSpring, useTransition, config } from 'react-spring';

export const useFadeIn = (delay = 0) => {
  return useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay,
    config: config.gentle
  });
};

export const useSlideUp = (delay = 0) => {
  return useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay,
    config: config.gentle
  });
};

export const useSlideDown = (delay = 0) => {
  return useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay,
    config: config.gentle
  });
};

export const useScale = (delay = 0) => {
  return useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay,
    config: config.wobbly
  });
};

export const useListAnimation = (items: any[]) => {
  return useTransition(items, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(-20px)' },
    trail: 100,
    config: config.gentle
  });
};

export const useHoverSpring = () => {
  return useSpring({
    from: { transform: 'translateY(0)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-2px)' });
        await next({ transform: 'translateY(0)' });
      }
    },
    config: { tension: 300, friction: 10 },
    pause: true
  });
};

export const useShimmer = () => {
  return useSpring({
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
    config: { duration: 2000 },
    loop: true
  });
};

export const usePulse = () => {
  return useSpring({
    from: { transform: 'scale(1)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.05)' });
        await next({ transform: 'scale(1)' });
      }
    },
    config: { tension: 300, friction: 10 },
    loop: true
  });
};

export const useRotate = () => {
  return useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    config: { duration: 2000 },
    loop: true
  });
}; 
import type { ReactNode } from 'react';
import useLenis from '../hooks/useLenis';

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useLenis();
  return <>{children}</>;
};

export default SmoothScroll;

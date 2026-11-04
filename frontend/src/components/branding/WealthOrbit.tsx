import React from 'react';
import { GoldenMonolith } from './GoldenMonolith';

interface WealthOrbitProps {
  isEntering?: boolean;
  onEntered?: () => void;
  size?: 'hero' | 'compact' | 'nav';
}

// Re-export GoldenMonolith as WealthOrbit for seamless backwards compatibility
export const WealthOrbit: React.FC<WealthOrbitProps> = (props) => {
  return <GoldenMonolith {...props} />;
};

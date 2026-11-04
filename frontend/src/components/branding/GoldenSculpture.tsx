import React from 'react';
import { GoldenLedger } from './GoldenLedger';

interface GoldenSculptureProps {
  isEntering?: boolean;
  onEntered?: () => void;
  size?: 'hero' | 'compact' | 'nav';
}

// Re-export GoldenLedger as GoldenSculpture for backwards compatibility
export const GoldenSculpture: React.FC<GoldenSculptureProps> = (props) => {
  return <GoldenLedger {...props} />;
};

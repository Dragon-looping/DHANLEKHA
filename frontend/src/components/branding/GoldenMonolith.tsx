import React from 'react';
import { GoldenSculpture } from './GoldenSculpture';

interface GoldenMonolithProps {
  isEntering?: boolean;
  onEntered?: () => void;
  size?: 'hero' | 'compact' | 'nav';
}

// Re-export GoldenSculpture as GoldenMonolith for backwards compatibility
export const GoldenMonolith: React.FC<GoldenMonolithProps> = (props) => {
  return <GoldenSculpture {...props} />;
};

import React from 'react';

interface BrandWordmarkProps {
  variant?: 'navbar' | 'compact' | 'large' | 'nav' | 'hero';
  showTagline?: boolean;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  variant = 'navbar',
  showTagline = false,
}) => {
  // -------------------------------------------------------------
  // Architectural Ledger Seal Emblem
  // Inspired by traditional Indian accounting manuscripts (बही-खाता)
  // Clean geometric talisman in champagne gold and deep obsidian
  // -------------------------------------------------------------
  const LedgerSeal = ({ size = 32 }: { size?: number }) => (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center shrink-0"
    >
      {/* Outer Soft Metallic Gold Geometric Diamond */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#E5D2A9] via-[#C6A568] to-[#A9874F] p-[1px] shadow-[0_2px_10px_rgba(198,165,104,0.22)]">
        <div className="w-full h-full rounded-lg bg-[#111111] flex items-center justify-center">
          {/* Authentic Devanagari Glyph 'ध' */}
          <span className="font-devanagari text-[#C6A568] font-bold text-base leading-none select-none">
            ध
          </span>
        </div>
      </div>
      {/* Subtle Balance Indicator Node */}
      <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-[#C6A568]" />
    </div>
  );

  // 1. Navbar & Default Header Variant (For #111111 / #101010 Navigation)
  if (variant === 'navbar' || variant === 'nav') {
    return (
      <div className="flex items-center gap-3 select-none text-left group cursor-pointer">
        <LedgerSeal size={34} />
        <div className="flex flex-col justify-center">
          {/* Primary Official Devanagari Wordmark: धनलेख */}
          <div className="flex items-baseline gap-2">
            <span className="font-devanagari text-[#F7F3EA] font-bold text-xl tracking-wide group-hover:text-[#C6A568] transition-colors leading-none">
              धनलेख
            </span>
            {/* Supporting Latin Typography */}
            <span className="font-sans font-extrabold text-[10px] tracking-[0.28em] text-[#C6A568] uppercase leading-none">
              DHANLEKHA
            </span>
          </div>
          {/* Subtle Institutional Subtitle */}
          <span className="text-[9px] font-mono tracking-widest text-[#EDE2CC]/60 uppercase pt-0.5">
            Personal Wealth Ledger
          </span>
        </div>
      </div>
    );
  }

  // 2. Compact Variant (For Mobile Headers, Sidebar, Cards)
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2.5 select-none text-left">
        <LedgerSeal size={28} />
        <div className="flex items-baseline gap-1.5">
          <span className="font-devanagari text-[#F7F3EA] font-bold text-lg leading-none">
            धनलेख
          </span>
          <span className="font-sans font-extrabold text-[9px] tracking-[0.24em] text-[#C6A568] uppercase leading-none">
            DHANLEKHA
          </span>
        </div>
      </div>
    );
  }

  // 3. Large / Auth Hero Variant (For Login, Signup, Onboarding)
  return (
    <div className="flex flex-col items-center sm:items-start space-y-3 select-none text-center sm:text-left">
      <div className="flex items-center gap-3.5">
        <LedgerSeal size={42} />
        <div className="flex flex-col text-left">
          <span className="font-devanagari text-3xl sm:text-4xl font-bold text-[#F7F3EA] tracking-wide leading-tight">
            धनलेख
          </span>
          <span className="font-sans font-black text-xs sm:text-sm tracking-[0.32em] text-[#C6A568] uppercase">
            DHANLEKHA
          </span>
        </div>
      </div>

      {showTagline && (
        <div className="pt-1 flex items-center gap-2 text-xs font-mono text-[#C6A568]/90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A9874F] animate-pulse" />
          <span className="italic text-[#EDE2CC]">"Every rupee has a story."</span>
        </div>
      )}
    </div>
  );
};

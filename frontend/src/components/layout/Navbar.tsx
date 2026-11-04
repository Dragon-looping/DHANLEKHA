import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { BrandWordmark } from '../branding/BrandWordmark';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  onOpenAddExpense?: () => void;
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenAddExpense,
  title,
  subtitle,
}) => {
  const currentMonth = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="h-16 border-b border-bronze/40 bg-background-primary/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile hamburger or page title */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-typography-secondary hover:text-ivory hover:bg-surface transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="lg:hidden">
          <BrandWordmark variant="compact" />
        </div>

        {title && (
          <div className="hidden lg:flex flex-col text-left">
            <h2 className="text-base font-bold text-ivory font-sans leading-tight">
              {title}
            </h2>
            {subtitle && (
              <span className="text-[11px] font-mono text-typography-muted">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Month Selector & Add Expense */}
      <div className="flex items-center gap-3">
        {/* Month Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border border-bronze/50 text-xs font-mono text-typography-secondary">
          <Calendar className="w-3.5 h-3.5 text-champagne" />
          <span>{currentMonth}</span>
        </div>

        {/* Add Expense Button */}
        {onOpenAddExpense && (
          <button
            onClick={onOpenAddExpense}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-champagne to-amber text-background-primary text-xs font-mono font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-golden-glow flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </header>
  );
};

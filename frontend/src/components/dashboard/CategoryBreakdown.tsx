import React from 'react';
import { CategoryBreakdownItem } from '../../types';
import { formatINR, CATEGORY_COLORS } from '../../utils/formatters';

interface CategoryBreakdownProps {
  data: CategoryBreakdownItem[];
  totalSpent: number;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  totalSpent,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-bronze/40">
        <h4 className="font-mono text-xs uppercase tracking-widest text-typography-secondary">
          Distribution Ledger
        </h4>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[11px] font-mono text-champagne hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {data.map((item) => {
          const isSelected = selectedCategory === item.category;
          const colorMeta = CATEGORY_COLORS[item.category] || { hex: '#D6B77A', bg: 'bg-white/5', text: 'text-ivory' };
          const percentage = totalSpent > 0 ? (item.amount / totalSpent) * 100 : 0;

          return (
            <div
              key={item.category}
              onClick={() => onSelectCategory(isSelected ? null : item.category)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                isSelected
                  ? 'bg-surface-elevated border-champagne/50 shadow-golden-glow'
                  : 'bg-surface/50 border-bronze/40 hover:border-champagne/30 hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colorMeta.hex }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-ivory group-hover:text-champagne transition-colors">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-typography-muted">
                    {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-ivory">
                  {formatINR(item.amount)}
                </div>
                <div className="text-[10px] font-mono text-typography-muted">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

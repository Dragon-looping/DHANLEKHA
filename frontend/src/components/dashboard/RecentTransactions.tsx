import React from 'react';
import { ArrowUpRight, Receipt, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Expense } from '../../types';
import { formatINR, formatDate, CATEGORY_COLORS } from '../../utils/formatters';

interface RecentTransactionsProps {
  expenses: Expense[];
  onDeleteExpense?: (id: string) => void;
  limit?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  expenses,
  onDeleteExpense,
  limit = 5,
}) => {
  const displayed = expenses.slice(0, limit);

  if (displayed.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-surface/40 border border-bronze/40 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-surface-elevated/80 border border-bronze/50 flex items-center justify-center text-champagne">
          <Receipt className="w-6 h-6" />
        </div>
        <p className="text-sm font-sans font-medium text-ivory">
          No transactions in this ledger yet
        </p>
        <p className="text-xs font-mono text-typography-muted max-w-xs">
          Record your first expenditure to begin tracking your financial distribution.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-bronze/40">
        <h4 className="font-mono text-xs uppercase tracking-widest text-typography-secondary">
          Recent Ledger Entries
        </h4>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-champagne hover:text-champagne-light transition-colors"
        >
          View Full Ledger
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {displayed.map((expense) => {
          const colorMeta = CATEGORY_COLORS[expense.category] || {
            hex: '#D6B77A',
            bg: 'bg-white/5',
            text: 'text-ivory',
          };

          return (
            <div
              key={expense.id}
              className="p-4 rounded-xl bg-surface/60 hover:bg-surface border border-bronze/40 hover:border-champagne/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-bronze/60"
                  style={{ backgroundColor: `${colorMeta.hex}18` }}
                >
                  <span
                    className="font-bold text-xs font-mono"
                    style={{ color: colorMeta.hex }}
                  >
                    {expense.category.charAt(0)}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ivory truncate group-hover:text-champagne transition-colors">
                    {expense.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-typography-muted">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm font-bold text-ivory tabular-nums">
                  -{formatINR(expense.amount)}
                </span>
                {onDeleteExpense && (
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    title="Delete entry"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-typography-muted hover:text-danger hover:bg-danger/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

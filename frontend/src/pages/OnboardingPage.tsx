import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import { formatINR } from '../utils/formatters';
import { BrandWordmark } from '../components/branding/BrandWordmark';
import { CurrencyInput } from '../components/common/CurrencyInput';

interface CustomCategoryItem {
  id: string;
  name: string;
  amount: number;
}

const DEFAULT_STARTER_CATEGORIES: CustomCategoryItem[] = [
  { id: '1', name: 'Rent & Housing', amount: 15000 },
  { id: '2', name: 'Food & Groceries', amount: 10000 },
  { id: '3', name: 'Savings & Investments', amount: 10000 },
  { id: '4', name: 'Transportation', amount: 5000 },
];

const SEGMENT_COLORS = [
  '#D6B77A', // champagne gold
  '#E5A94B', // warm amber
  '#00C99A', // emerald accent
  '#B89758', // dark bronze gold
  '#D98236', // terracotta
  '#EADEC3', // pale champagne
  '#C4A87C', // muted gold
  '#A69A87', // warm stone
];

export const OnboardingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [salary, setSalary] = useState<number>(50000);
  const [categories, setCategories] = useState<CustomCategoryItem[]>(DEFAULT_STARTER_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalAllocated = categories.reduce((sum, item) => sum + (item.amount || 0), 0);
  const unallocated = Math.max(0, salary - totalAllocated);
  const isOverAllocated = totalAllocated > salary;

  const handleAddCategory = () => {
    const newId = Date.now().toString();
    setCategories([
      ...categories,
      { id: newId, name: 'New Category', amount: 0 },
    ]);
  };

  const handleUpdateCategory = (id: string, name: string, amount: number) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, name, amount: Math.max(0, amount) } : c))
    );
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isNaN(salary) || salary <= 0) {
      setError('Please provide a valid monthly salary greater than ₹0.');
      return;
    }

    if (salary > 1000000000) {
      setError('Salary exceeds the maximum allowable threshold of ₹1,00,00,00,000.');
      return;
    }

    if (isOverAllocated) {
      setError(`Total allocated (${formatINR(totalAllocated)}) exceeds your monthly salary by ${formatINR(totalAllocated - salary)}.`);
      return;
    }

    try {
      setLoading(true);
      // 1. Commit user monthly income
      await budgetService.setSalary(salary);

      // 2. Commit custom category allocation dictionary
      const allocationsMap: Record<string, number> = {};
      categories.forEach((c) => {
        if (c.name.trim()) {
          allocationsMap[c.name.trim()] = c.amount;
        }
      });
      await budgetService.setCustomAllocations(allocationsMap);

      // 3. Refresh user state & proceed to dashboard
      await refreshUser();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to save onboarding parameters. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background-primary flex flex-col justify-between p-6 sm:p-12 overflow-y-auto select-none">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-bronze/40 pb-5">
        <BrandWordmark variant="compact" />
        <span className="text-xs font-mono text-champagne uppercase tracking-widest">
          Sovereign Financial Blueprint
        </span>
      </div>

      {/* Main Content Box */}
      <div className="max-w-3xl mx-auto w-full my-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-bronze/60 shadow-cinematic space-y-8 text-left">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-champagne/20 text-[10px] font-mono tracking-widest text-champagne uppercase">
              <Sparkles className="w-3 h-3 text-amber" />
              WELCOME TO DHANLEKHA
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-ivory tracking-tight">
              Let's understand your financial world.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-typography-secondary leading-relaxed">
              Define your monthly income and design your own capital distribution freely. No forced formulas.
            </p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Monthly Income with Robust CurrencyInput */}
            <div className="space-y-3 p-6 rounded-2xl bg-surface-card border border-bronze/50">
              <label className="block text-xs font-mono uppercase tracking-wider text-champagne">
                Step 1: Enter Monthly Net Salary / Income (INR)
              </label>
              <div className="max-w-md">
                <CurrencyInput
                  value={salary}
                  onChange={(numericVal) => setSalary(numericVal)}
                  placeholder="50000"
                  required
                />
              </div>
              <p className="text-[11px] font-mono text-typography-muted">
                Your total monthly incoming cashflow available for distribution. Accepts any amount (e.g. ₹500, ₹49,999, ₹50,000, ₹75,000, or decimal values like ₹50,000.50).
              </p>
            </div>

            {/* Step 2: Custom Allocations */}
            <div className="space-y-4 p-6 rounded-2xl bg-surface-card border border-bronze/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bronze/40 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-ivory uppercase tracking-wider font-mono">
                    Step 2: Custom Financial Allocations
                  </h4>
                  <p className="text-xs text-typography-muted font-sans mt-0.5">
                    Add, edit, or adjust category amounts freely. Unallocated money is retained as liquid buffer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-elevated border border-champagne/30 hover:border-champagne text-xs font-mono text-champagne hover:text-ivory transition-colors flex items-center gap-1.5 w-fit"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Real-time Allocation Overview Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-typography-secondary">
                    Allocated: <strong className="text-champagne font-mono">{formatINR(totalAllocated)}</strong>
                    {salary > 0 && ` (${((totalAllocated / salary) * 100).toFixed(1)}%)`}
                  </span>
                  <span className={isOverAllocated ? 'text-danger font-bold' : 'text-accent-emerald font-bold'}>
                    Unallocated Buffer: {formatINR(unallocated)}
                  </span>
                </div>

                {/* Multi-segment visual progress bar */}
                <div className="w-full h-3 rounded-full bg-surface-elevated overflow-hidden flex border border-bronze/40">
                  {categories.map((c, idx) => {
                    if (c.amount <= 0 || salary <= 0) return null;
                    const widthPercent = (c.amount / salary) * 100;
                    const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
                    return (
                      <div
                        key={c.id}
                        title={`${c.name}: ${formatINR(c.amount)} (${widthPercent.toFixed(1)}%)`}
                        style={{ width: `${Math.min(widthPercent, 100)}%`, backgroundColor: color }}
                        className="h-full transition-all duration-300 first:rounded-l-full"
                      />
                    );
                  })}
                  {unallocated > 0 && salary > 0 && (
                    <div
                      title={`Unallocated Buffer: ${formatINR(unallocated)}`}
                      style={{ width: `${(unallocated / salary) * 100}%` }}
                      className="h-full bg-bronze-light/40"
                    />
                  )}
                </div>
              </div>

              {/* Editable Category Rows */}
              <div className="space-y-3 pt-3">
                {categories.map((item, index) => {
                  const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
                  const pct = salary > 0 ? ((item.amount / salary) * 100).toFixed(1) : '0';

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-surface border border-bronze/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 group hover:border-champagne/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) => handleUpdateCategory(item.id, e.target.value, item.amount)}
                          placeholder="Category Name"
                          className="w-full sm:w-56 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-bronze/60 text-ivory text-xs font-semibold focus:outline-none focus:border-champagne transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 shrink-0">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-champagne text-xs font-mono">
                            ₹
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => {
                              const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                              handleUpdateCategory(item.id, item.name, parseFloat(cleaned) || 0);
                            }}
                            placeholder="0"
                            className="w-28 pl-6 pr-2.5 py-1.5 rounded-lg bg-surface-elevated border border-bronze/60 text-ivory text-xs font-mono font-bold focus:outline-none focus:border-champagne text-right"
                          />
                        </div>

                        <span className="w-12 text-right text-[11px] font-mono text-typography-muted">
                          {pct}%
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(item.id)}
                          className="p-1.5 rounded-lg text-typography-muted hover:text-danger hover:bg-danger/10 transition-colors"
                          title="Remove category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commit Action */}
            <button
              type="submit"
              disabled={loading || isOverAllocated}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-champagne to-amber text-background-primary text-xs font-mono font-bold uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-golden-glow disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Committing Blueprint...' : 'Initialize Financial Command Centre'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs font-mono text-typography-muted border-t border-bronze/40 pt-4">
        DHANLEKHA • Autonomous Personal Wealth Stewardship
      </div>
    </div>
  );
};

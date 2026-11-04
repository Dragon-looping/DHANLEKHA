import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { budgetService } from '../services/budgetService';
import { BudgetSummary } from '../types';
import { formatINR, CATEGORY_COLORS } from '../utils/formatters';
import { Plus, Trash2, Edit3, AlertCircle, CheckCircle, Wallet, Sliders, ShieldCheck } from 'lucide-react';
import { CurrencyInput } from '../components/common/CurrencyInput';

interface CustomCategoryItem {
  id: string;
  name: string;
  amount: number;
}

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

export const BudgetPage: React.FC = () => {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit salary state
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');

  // Custom allocation categories state
  const [isEditingAllocations, setIsEditingAllocations] = useState(false);
  const [categories, setCategories] = useState<CustomCategoryItem[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [allocationError, setAllocationError] = useState<string | null>(null);

  const loadBudget = useCallback(async () => {
    try {
      setLoading(true);
      const data = await budgetService.getBudgetSummary();
      setSummary(data);
      setSalaryInput(data.salary?.toString() || '');

      // Load existing custom allocations or map category budgets
      if (data.customAllocations && Object.keys(data.customAllocations).length > 0) {
        const items = Object.entries(data.customAllocations).map(([name, amount], index) => ({
          id: index.toString(),
          name,
          amount: typeof amount === 'number' ? amount : parseFloat(amount as any) || 0,
        }));
        setCategories(items);
      } else {
        // Starter defaults if none saved yet
        setCategories([
          { id: '1', name: 'Housing and Rent', amount: Math.round(data.salary * 0.3) },
          { id: '2', name: 'Food and Dining', amount: Math.round(data.salary * 0.2) },
          { id: '3', name: 'Savings & Reserves', amount: Math.round(data.salary * 0.2) },
          { id: '4', name: 'Transportation', amount: Math.round(data.salary * 0.1) },
        ]);
      }
    } catch (err) {
      console.error('Failed to load budget:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const handleUpdateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(salaryInput);
    if (isNaN(val) || val <= 0) return;

    try {
      setSaveLoading(true);
      await budgetService.setSalary(val);
      setIsEditingSalary(false);
      await loadBudget();
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: 'New Allocation', amount: 0 },
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

  const handleSaveAllocations = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocationError(null);

    const totalAlloc = categories.reduce((sum, c) => sum + (c.amount || 0), 0);
    const sal = summary?.salary || 0;
    if (totalAlloc > sal) {
      setAllocationError(`Allocations (${formatINR(totalAlloc)}) exceed monthly salary by ${formatINR(totalAlloc - sal)}.`);
      return;
    }

    try {
      setSaveLoading(true);
      const allocationsMap: Record<string, number> = {};
      categories.forEach((c) => {
        if (c.name.trim()) {
          allocationsMap[c.name.trim()] = c.amount;
        }
      });
      await budgetService.setCustomAllocations(allocationsMap);
      setIsEditingAllocations(false);
      await loadBudget();
    } catch (err: any) {
      setAllocationError(err?.message || 'Failed to save allocations.');
    } finally {
      setSaveLoading(false);
    }
  };

  const salary = summary?.salary || 0;
  const totalAllocated = summary?.totalAllocated ?? categories.reduce((sum, c) => sum + c.amount, 0);
  const unallocated = summary?.unallocated ?? Math.max(0, salary - totalAllocated);
  const totalSpent = summary?.totalExpenditure || 0;
  const remainingOverall = Math.max(0, salary - totalSpent);

  return (
    <AppShell
      title="Custom Allocation Architecture"
      subtitle="Autonomous income division, category limits, and wealth retention"
      onRefreshData={loadBudget}
    >
      {/* Top Banner: Salary & Allocation Summary */}
      <div className="p-8 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md space-y-6 shadow-cinematic text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-champagne">
              Sovereign Architecture
            </span>
            <h2 className="text-2xl font-bold font-sans text-ivory">
              Personal Financial Blueprint
            </h2>
            <p className="text-xs text-typography-secondary font-sans mt-0.5">
              User-directed capital division without hardcoded formulas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingSalary(!isEditingSalary)}
              className="px-4 py-2 rounded-xl bg-surface-elevated border border-bronze/60 hover:border-champagne/40 text-xs font-mono text-typography-secondary hover:text-champagne transition-all flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5 text-champagne" />
              <span>Modify Salary</span>
            </button>

            <button
              onClick={() => setIsEditingAllocations(!isEditingAllocations)}
              className="px-4 py-2 rounded-xl bg-surface-elevated border border-bronze/60 hover:border-champagne/40 text-xs font-mono text-typography-secondary hover:text-champagne transition-all flex items-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-champagne" />
              <span>{isEditingAllocations ? 'Close Editor' : 'Edit Allocations'}</span>
            </button>
          </div>
        </div>

        {/* Quick Inline Salary Edit */}
        {isEditingSalary && (
          <form onSubmit={handleUpdateSalary} className="p-5 rounded-2xl bg-surface-elevated border border-champagne/30 space-y-3">
            <div className="text-xs font-mono text-champagne uppercase tracking-wider">
              Update Monthly Salary (INR)
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
              <CurrencyInput
                value={salaryInput}
                onChange={(num, raw) => setSalaryInput(raw)}
                placeholder="50000"
                showPreview={false}
              />
              <button
                type="submit"
                disabled={saveLoading}
                className="px-6 py-3 rounded-xl bg-champagne text-background-primary text-xs font-bold font-mono uppercase shrink-0 hover:bg-champagne-light transition-all shadow-champagne-glow"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Financial Stat Cards (Income, Allocated, Spent, Remaining, Unallocated) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-surface-card border border-bronze/40">
            <div className="text-[10px] font-mono text-typography-muted uppercase">Monthly Income</div>
            <div className="text-lg font-bold font-mono text-ivory tabular-nums mt-1">{formatINR(salary)}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-bronze/40">
            <div className="text-[10px] font-mono text-typography-muted uppercase">Allocated</div>
            <div className="text-lg font-bold font-mono text-champagne tabular-nums mt-1">{formatINR(totalAllocated)}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-bronze/40">
            <div className="text-[10px] font-mono text-typography-muted uppercase">Spent Outflow</div>
            <div className="text-lg font-bold font-mono text-amber tabular-nums mt-1">{formatINR(totalSpent)}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-bronze/40">
            <div className="text-[10px] font-mono text-typography-muted uppercase">Remaining Budget</div>
            <div className="text-lg font-bold font-mono text-ivory tabular-nums mt-1">{formatINR(remainingOverall)}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-bronze/40 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-typography-muted uppercase">Unallocated Buffer</div>
            <div className="text-lg font-bold font-mono text-accent-emerald tabular-nums mt-1">{formatINR(unallocated)}</div>
          </div>
        </div>
      </div>

      {/* Custom Allocations Editor Modal / Section */}
      {isEditingAllocations && (
        <form onSubmit={handleSaveAllocations} className="p-8 rounded-3xl bg-surface border border-champagne/40 shadow-golden-glow space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bronze/40 pb-4">
            <div>
              <h3 className="text-base font-bold text-ivory font-mono uppercase tracking-wider">
                Edit Custom Category Allocations
              </h3>
              <p className="text-xs text-typography-secondary font-sans mt-0.5">
                Set intended allocation amounts. Remaining money will be retained as unallocated buffer.
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

          {allocationError && (
            <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
              {allocationError}
            </div>
          )}

          <div className="space-y-3">
            {categories.map((c, idx) => {
              const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
              const pct = salary > 0 ? ((c.amount / salary) * 100).toFixed(1) : '0';

              return (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-surface-elevated/60 border border-bronze/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <input
                      type="text"
                      required
                      value={c.name}
                      onChange={(e) => handleUpdateCategory(c.id, e.target.value, c.amount)}
                      className="w-full sm:w-56 px-2.5 py-1.5 rounded-lg bg-surface border border-bronze/60 text-ivory text-xs font-semibold focus:outline-none focus:border-champagne"
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
                        value={c.amount === 0 ? '' : c.amount}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                          handleUpdateCategory(c.id, c.name, parseFloat(cleaned) || 0);
                        }}
                        placeholder="0"
                        className="w-28 pl-6 pr-2.5 py-1.5 rounded-lg bg-surface border border-bronze/60 text-ivory text-xs font-mono font-bold focus:outline-none focus:border-champagne text-right"
                      />
                    </div>

                    <span className="w-12 text-right text-[11px] font-mono text-typography-muted">
                      {pct}%
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(c.id)}
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-bronze/40">
            <button
              type="button"
              onClick={() => setIsEditingAllocations(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-typography-secondary hover:text-ivory"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-champagne to-amber text-background-primary text-xs font-mono font-bold uppercase tracking-wider hover:opacity-95 shadow-golden-glow"
            >
              {saveLoading ? 'Saving...' : 'Commit Allocations'}
            </button>
          </div>
        </form>
      )}

      {/* Dynamic Category Allocation Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {summary?.categoryBudgets?.map((cat, index) => {
          const colorMeta = CATEGORY_COLORS[cat.category] || { hex: SEGMENT_COLORS[index % SEGMENT_COLORS.length] };
          const isOverBudget = cat.allocated > 0 && cat.spent > cat.allocated;
          const pctUsed = cat.percentageUsed || (cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0);

          return (
            <div
              key={cat.category}
              className="p-6 rounded-3xl bg-surface border border-bronze/50 backdrop-blur-md flex flex-col justify-between space-y-5 shadow-cinematic hover:border-champagne/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: colorMeta.hex }}
                    />
                    <h3 className="text-sm font-bold text-ivory font-sans truncate">
                      {cat.category}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isOverBudget
                        ? 'bg-danger/10 text-danger border border-danger/30'
                        : 'bg-champagne/10 text-champagne border border-champagne/20'
                    }`}
                  >
                    {cat.allocated > 0 ? `${pctUsed.toFixed(1)}% Used` : 'Unassigned'}
                  </span>
                </div>

                {/* Numbers */}
                <div className="space-y-1.5 pt-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-typography-secondary">
                    <span>Intended Allocation:</span>
                    <span className="font-bold text-ivory">{formatINR(cat.allocated)}</span>
                  </div>
                  <div className="flex items-center justify-between text-typography-secondary">
                    <span>Actual Outflow:</span>
                    <span className="font-bold text-amber">{formatINR(cat.spent)}</span>
                  </div>
                  <div className="flex items-center justify-between text-typography-secondary">
                    <span>Remaining Limit:</span>
                    <span className={`font-bold ${cat.remaining < 0 ? 'text-danger' : 'text-accent-emerald'}`}>
                      {formatINR(cat.remaining)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden mt-3 border border-bronze/30">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-danger' : 'bg-gradient-to-r from-champagne to-amber'
                    }`}
                    style={{
                      width: `${Math.min(cat.allocated > 0 ? pctUsed : (cat.spent > 0 ? 100 : 0), 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Status / Warning */}
              {isOverBudget ? (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-2 text-xs text-danger font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Outflow exceeded allocation by {formatINR(Math.abs(cat.remaining))}.</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-surface-card border border-bronze/30 flex items-center gap-2 text-xs text-typography-muted font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Within intended personal allocation.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
};

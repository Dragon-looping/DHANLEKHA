import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { DeleteConfirmModal } from '../components/expenses/DeleteConfirmModal';
import { expenseService } from '../services/expenseService';
import { Expense } from '../types';
import { formatINR, formatDate, CATEGORY_COLORS, STANDARD_CATEGORIES } from '../utils/formatters';
import { Search, ArrowUpDown, Trash2, Calendar, Receipt } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses({
        search,
        category,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder,
      });
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, startDate, endDate, sortBy, sortOrder]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await expenseService.deleteExpense(deleteTargetId);
      setDeleteTargetId(null);
      await loadExpenses();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  const totalFilteredAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const expenseToDelete = expenses.find((e) => e.id === deleteTargetId);

  return (
    <AppShell
      title="Financial Ledger"
      subtitle="Complete chronological transaction record and auditing"
      onRefreshData={loadExpenses}
    >
      {/* Top Filter and Search Bar */}
      <div className="p-7 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md space-y-4 shadow-cinematic text-left">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-typography-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by transaction title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-xs focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/40 transition-all placeholder:text-typography-muted/40 font-mono"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3.5 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-xs focus:outline-none focus:border-champagne/60 transition-all font-sans"
            >
              <option value="ALL">All Categories</option>
              {STANDARD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => {
                if (sortBy === 'date') {
                  setSortBy('amount');
                } else {
                  setSortBy('date');
                }
              }}
              className="px-3.5 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-typography-secondary hover:text-ivory text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-champagne" />
              <span>Sort: {sortBy === 'date' ? 'Date' : 'Amount'}</span>
            </button>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3.5 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-typography-secondary hover:text-ivory text-xs font-mono transition-colors"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-bronze/40 text-xs font-mono text-typography-secondary">
          <span className="flex items-center gap-1.5 text-typography-muted">
            <Calendar className="w-3.5 h-3.5 text-champagne" />
            Date Filter:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface-elevated/70 border border-bronze/60 text-ivory text-xs focus:outline-none focus:border-champagne/60 font-mono"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface-elevated/70 border border-bronze/60 text-ivory text-xs focus:outline-none focus:border-champagne/60 font-mono"
            />
          </div>

          {(startDate || endDate || search || category !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-champagne hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary of Filtered View */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-typography-secondary">
        <div>
          Showing <span className="font-bold text-ivory">{expenses.length}</span> recorded entries
        </div>
        <div>
          Filtered Outflow Total:{' '}
          <span className="font-bold text-champagne font-mono">{formatINR(totalFilteredAmount)}</span>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md overflow-hidden shadow-cinematic">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-typography-muted">
            Loading ledger entries...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-bronze/50 flex items-center justify-center text-champagne">
              <Receipt className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-ivory font-sans">
              No matching records found
            </h4>
            <p className="text-xs font-mono text-typography-muted max-w-sm">
              Adjust search keywords or filters to inspect other transactions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-bronze/40">
            {expenses.map((expense) => {
              const colorMeta = CATEGORY_COLORS[expense.category] || {
                hex: '#D6B77A',
                bg: 'bg-white/5',
                text: 'text-ivory',
              };

              return (
                <div
                  key={expense.id}
                  className="p-5 hover:bg-surface-elevated/40 transition-colors flex items-center justify-between gap-4 group text-left"
                >
                  {/* Left: Category Icon & Title */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-bronze/60"
                      style={{ backgroundColor: `${colorMeta.hex}18` }}
                    >
                      <span className="font-bold text-sm font-mono" style={{ color: colorMeta.hex }}>
                        {expense.category.charAt(0)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-ivory truncate group-hover:text-champagne transition-colors">
                        {expense.title}
                      </div>
                      {expense.description && (
                        <p className="text-xs text-typography-muted truncate max-w-md font-sans">
                          {expense.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-typography-muted">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${colorMeta.hex}18`,
                            color: colorMeta.hex,
                          }}
                        >
                          {expense.category}
                        </span>
                        <span>•</span>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete Button */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-mono font-bold text-ivory tabular-nums">
                        -{formatINR(expense.amount)}
                      </div>
                      <div className="text-[10px] font-mono text-typography-muted">
                        DEBIT ENTRY
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteTargetId(expense.id)}
                      title="Delete record"
                      className="p-2 rounded-xl text-typography-muted hover:text-danger hover:bg-danger/10 opacity-70 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title={expenseToDelete?.title || 'Selected record'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AppShell>
  );
};

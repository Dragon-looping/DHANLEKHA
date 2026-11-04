import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, FileText, IndianRupee } from 'lucide-react';
import { expenseService } from '../../services/expenseService';
import { STANDARD_CATEGORIES } from '../../utils/formatters';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(STANDARD_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please specify a positive expense amount greater than zero.');
      return;
    }

    if (!title.trim()) {
      setError('Expense title is required.');
      return;
    }

    try {
      setLoading(true);
      await expenseService.addExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        description: description.trim(),
      });

      // Reset form
      setTitle('');
      setAmount('');
      setCategory(STANDARD_CATEGORIES[0]);
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to record expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-primary/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-bronze/70 shadow-cinematic overflow-hidden text-left">
        {/* Header */}
        <div className="px-7 py-6 border-b border-bronze/50 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-champagne">
              Ledger Entry
            </span>
            <h3 className="font-sans text-xl font-bold text-ivory">
              Record New Expense
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-typography-muted hover:text-ivory hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
              Expense Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Groceries at Nature's Basket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-sm focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/40 transition-all placeholder:text-typography-muted/40 font-sans"
            />
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
                Amount (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-champagne font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-sm font-mono focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/40 transition-all placeholder:text-typography-muted/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-sm focus:outline-none focus:border-champagne/60 transition-all font-sans"
              >
                {STANDARD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-surface text-ivory">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
              Transaction Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-sm font-mono focus:outline-none focus:border-champagne/60 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add contextual details for this ledger entry..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated/70 border border-bronze/60 text-ivory text-sm focus:outline-none focus:border-champagne/60 transition-all placeholder:text-typography-muted/40 resize-none font-sans"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-typography-secondary hover:text-ivory hover:bg-surface-elevated transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-champagne to-amber text-background-primary text-xs font-mono font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-golden-glow disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Recording...' : 'Commit to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

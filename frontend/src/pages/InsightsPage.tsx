import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsSummary, CategoryBreakdownItem } from '../types';
import { formatINR, CATEGORY_COLORS } from '../utils/formatters';
import { Sparkles, Trophy, Flame, Layers, TrendingUp, Compass, PieChart } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [sum, cats] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategoryBreakdown(),
      ]);
      setSummary(sum);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const hasData = summary && summary.totalTransactions > 0;

  return (
    <AppShell
      title="Financial Intelligence & Insights"
      subtitle="Behavioral spending velocity, capital efficiency, and anomaly detection"
      onRefreshData={loadAnalytics}
    >
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md space-y-2 shadow-cinematic text-left">
        <span className="font-mono text-[10px] uppercase tracking-widest text-champagne">
          Algorithmic Analysis
        </span>
        <h2 className="text-2xl font-bold font-sans text-ivory">
          Capital Trajectory Intelligence
        </h2>
        <p className="text-xs text-typography-secondary font-sans">
          Synthesized directly from your authenticated in-memory ledger entries.
        </p>
      </div>

      {!hasData ? (
        <div className="p-16 rounded-3xl bg-surface/40 border border-bronze/40 text-center flex flex-col items-center justify-center space-y-3 shadow-cinematic">
          <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-bronze/50 flex items-center justify-center text-champagne">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-sans text-ivory">
            Insufficient Ledger Records
          </h3>
          <p className="text-xs font-mono text-typography-muted max-w-md">
            Record at least one expense in DHANLEKHA to activate deep mathematical spending analysis, velocity metrics, and category comparisons.
          </p>
        </div>
      ) : (
        <div className="space-y-6 text-left">
          {/* Key Intelligence Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Highest Outflow Category */}
            <div className="p-6 rounded-2xl bg-surface border border-bronze/50 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-typography-secondary uppercase">
                <span>Top Outflow Category</span>
                <Flame className="w-4 h-4 text-amber" />
              </div>
              <div className="text-xl font-bold text-ivory font-sans truncate">
                {summary.highestCategory}
              </div>
              <div className="text-xs font-mono font-bold text-amber">
                {formatINR(summary.highestCategoryAmount)} Total
              </div>
            </div>

            {/* 2. Largest Single Transaction */}
            <div className="p-6 rounded-2xl bg-surface border border-bronze/50 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-typography-secondary uppercase">
                <span>Peak Single Outflow</span>
                <Trophy className="w-4 h-4 text-champagne" />
              </div>
              <div className="text-xl font-bold text-ivory font-sans truncate">
                {summary.largestExpense ? summary.largestExpense.title : 'None'}
              </div>
              <div className="text-xs font-mono font-bold text-champagne">
                {summary.largestExpense ? formatINR(summary.largestExpense.amount) : '₹0'}
              </div>
            </div>

            {/* 3. Average Ticket Size */}
            <div className="p-6 rounded-2xl bg-surface border border-bronze/50 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-typography-secondary uppercase">
                <span>Mean Transaction Ticket</span>
                <TrendingUp className="w-4 h-4 text-accent-emerald" />
              </div>
              <div className="text-xl font-bold text-ivory font-mono tabular-nums">
                {formatINR(summary.averageTransaction)}
              </div>
              <div className="text-xs font-mono text-typography-muted">
                Across {summary.totalTransactions} recorded entries
              </div>
            </div>

            {/* 4. Salary Depletion Velocity */}
            <div className="p-6 rounded-2xl bg-surface border border-bronze/50 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-typography-secondary uppercase">
                <span>Income Depletion Rate</span>
                <Layers className="w-4 h-4 text-champagne-light" />
              </div>
              <div className="text-xl font-bold text-ivory font-mono tabular-nums">
                {summary.salarySpentPercentage.toFixed(1)}%
              </div>
              <div className="text-xs font-mono text-typography-muted">
                {formatINR(summary.balance)} Liquidity Remaining
              </div>
            </div>
          </div>

          {/* Category Expenditure Comparison Chart */}
          <div className="p-8 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md space-y-6 shadow-cinematic">
            <div className="flex items-center justify-between border-b border-bronze/40 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-champagne">
                  Proportional Breakdown
                </span>
                <h3 className="text-lg font-bold font-sans text-ivory">
                  Category Weight Comparison
                </h3>
              </div>
              <span className="text-xs font-mono text-typography-muted">
                Relative to ₹{summary.totalSpent.toLocaleString('en-IN')} Total Spent
              </span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const colorMeta = CATEGORY_COLORS[cat.category] || { hex: '#D6B77A' };
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: colorMeta.hex }}
                        />
                        <span className="font-semibold text-ivory">{cat.category}</span>
                        <span className="text-typography-muted">({cat.count} txns)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-ivory">{formatINR(cat.amount)}</span>
                        <span className="text-typography-muted w-12 text-right">{cat.percentage.toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Minimal Horizontal Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden border border-bronze/30">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: colorMeta.hex,
                          width: `${Math.min(cat.percentage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

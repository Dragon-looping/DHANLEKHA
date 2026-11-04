import React, { useEffect, useState } from 'react';
import { ArrowUpRight, TrendingDown, Wallet, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface BalanceOverviewProps {
  income: number;
  expenses: number;
  available: number;
  savings: number;
  unallocated?: number;
}

export const BalanceOverview: React.FC<BalanceOverviewProps> = ({
  income,
  expenses,
  available,
  savings,
  unallocated = 0,
}) => {
  // Count-up display animation
  const [displayIncome, setDisplayIncome] = useState(0);
  const [displayExpenses, setDisplayExpenses] = useState(0);
  const [displayAvailable, setDisplayAvailable] = useState(0);
  const [displaySavings, setDisplaySavings] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 26;
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayIncome(Math.round(income * ease));
      setDisplayExpenses(Math.round(expenses * ease));
      setDisplayAvailable(Math.round(available * ease));
      setDisplaySavings(Math.round(savings * ease));

      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [income, expenses, available, savings]);

  const spendPercentage = income > 0 ? ((expenses / income) * 100).toFixed(1) : '0';
  const retentionPercentage = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';
  const isDeficit = available < 0;

  return (
    <div className="select-none grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Primary Hero Balance Block (7 of 12 cols) */}
      <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md relative overflow-hidden flex flex-col justify-between shadow-cinematic text-left group">
        {/* Warm Golden Illumination Behind Primary Figure */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(214,183,122,0.08)_0%,transparent_70%)] blur-2xl pointer-events-none" />

        {/* Top Meta Line */}
        <div className="flex items-center justify-between pb-6 border-b border-bronze/40">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-champagne">
              Available Liquid Capital
            </span>
          </div>
          <span
            className={`text-[11px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-semibold border ${
              isDeficit
                ? 'bg-danger/15 text-danger border-danger/30'
                : 'bg-emerald/15 text-emerald border-emerald/30'
            }`}
          >
            {isDeficit ? 'Deficit Warning' : 'Liquid Surplus'}
          </span>
        </div>

        {/* Huge Hero Numeric Balance Display */}
        <div className="py-8 space-y-2">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-mono text-ivory tracking-tight">
            {formatINR(displayAvailable)}
          </div>
          <p className="text-xs sm:text-sm text-typography-secondary font-sans leading-relaxed">
            {isDeficit
              ? 'Current expenditures exceed recorded monthly inflow. Adjust budget allocations or reduce discretionary outflows.'
              : 'Unencumbered liquidity remaining after all recorded living expenses and commitments.'}
          </p>
        </div>

        {/* Bottom Metric Bar */}
        <div className="pt-6 border-t border-bronze/40 grid grid-cols-2 gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-typography-muted">
              Effective Retention
            </span>
            <div className="font-mono text-base font-bold text-champagne mt-0.5">
              {retentionPercentage}%
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-typography-muted">
              Outflow Ratio
            </span>
            <div className="font-mono text-base font-bold text-amber mt-0.5">
              {spendPercentage}% of Inflow
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metric Stream Block (5 of 12 cols) with Hairline Dividers */}
      <div className="lg:col-span-5 p-8 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md flex flex-col justify-between shadow-cinematic text-left">
        {/* Stream 1: Monthly Income */}
        <div className="pb-6 border-b border-bronze/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-typography-secondary">
              Monthly Inflow
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-champagne/10 text-champagne border border-champagne/20">
              Salary Anchor
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-ivory">
            {formatINR(displayIncome)}
          </div>
          <div className="text-[11px] text-typography-muted font-sans">
            Net monthly baseline verified in session memory
          </div>
        </div>

        {/* Stream 2: Total Outflow */}
        <div className="py-6 border-b border-bronze/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-typography-secondary">
              Total Outflow
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20">
              {expenses > 0 ? 'Active' : 'Zero Spend'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber">
            {formatINR(displayExpenses)}
          </div>
          <div className="text-[11px] text-typography-muted font-sans">
            {spendPercentage}% of monthly income deployed
          </div>
        </div>

        {/* Stream 3: Retained Savings */}
        <div className="pt-6 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-typography-secondary">
              Retained Capital
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20">
              Preserved
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald">
            {formatINR(displaySavings)}
          </div>
          <div className="text-[11px] text-typography-muted font-sans">
            Preserved surplus towards wealth accumulation
          </div>
        </div>
      </div>
    </div>
  );
};

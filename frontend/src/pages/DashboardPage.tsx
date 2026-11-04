import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BalanceOverview } from '../components/dashboard/BalanceOverview';
import { ExpensePieChart3D } from '../components/dashboard/ExpensePieChart3D';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { DeleteConfirmModal } from '../components/expenses/DeleteConfirmModal';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import { expenseService } from '../services/expenseService';
import { analyticsService } from '../services/analyticsService';
import { BudgetSummary, Expense, CategoryBreakdownItem } from '../types';
import { formatINR } from '../utils/formatters';
import {
  Plus,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Percent,
  Activity,
  Layers,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdownItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Expense modal state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [summaryData, expensesData, categoriesData] = await Promise.all([
        budgetService.getBudgetSummary(),
        expenseService.getExpenses({ sortBy: 'date', sortOrder: 'desc' }),
        analyticsService.getCategoryBreakdown(),
      ]);

      setBudgetSummary(summaryData);
      setExpenses(expensesData);
      setCategories(categoriesData);

      // If user hasn't set salary yet, redirect to onboarding
      if (!summaryData.salary || summaryData.salary <= 0) {
        navigate('/onboarding');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDeleteExpense = async () => {
    if (!deleteTargetId) return;
    try {
      await expenseService.deleteExpense(deleteTargetId);
      setDeleteTargetId(null);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  // Financial Intelligence Derived Metrics
  const insights = useMemo(() => {
    const totalSpent = budgetSummary?.totalExpenditure || 0;
    const salary = budgetSummary?.salary || 0;
    const count = expenses.length;

    // Highest expense category
    let topCategory = { category: 'None', amount: 0, percentage: 0 };
    if (categories.length > 0) {
      const sorted = [...categories].sort((a, b) => b.amount - a.amount);
      if (sorted[0] && sorted[0].amount > 0) {
        topCategory = {
          category: sorted[0].category,
          amount: sorted[0].amount,
          percentage: totalSpent > 0 ? (sorted[0].amount / totalSpent) * 100 : 0,
        };
      }
    }

    // Mean ticket size
    const avgTicket = count > 0 ? totalSpent / count : 0;

    // Retention rate
    const retentionRate = salary > 0 ? ((budgetSummary?.actualSavings || 0) / salary) * 100 : 0;

    return {
      topCategory,
      avgTicket,
      count,
      retentionRate,
    };
  }, [budgetSummary, expenses, categories]);

  // Current Month String
  const currentMonthName = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const expenseToDelete = expenses.find((e) => e.id === deleteTargetId);

  return (
    <AppShell
      title="Financial Command Centre"
      subtitle="Real-time wealth distribution and expenditure intelligence"
      onRefreshData={fetchDashboardData}
    >
      <div className="space-y-8 select-none">
        {/* Editorial Command Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 text-left border-b border-bronze/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-champagne">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span>DHANLEKHA / FINANCIAL OVERVIEW</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-ivory tracking-tight">
              YOUR FINANCIAL WORLD.
            </h1>
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-typography-secondary font-sans">
              <span className="text-ivory font-medium">Welcome back, {user?.name || 'Steward'}.</span>
              <span className="hidden sm:inline text-typography-muted">•</span>
              <span>Here is where your money stands.</span>
            </div>
          </div>

          {/* Month Selector & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Current Month Capsule */}
            <div className="px-4 py-2.5 rounded-2xl bg-surface border border-bronze/60 text-xs font-mono text-ivory flex items-center gap-2.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-champagne" />
              <span className="uppercase tracking-wider">{currentMonthName}</span>
            </div>

            {/* Prominent + Record Expense CTA */}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-champagne text-background-primary text-xs font-mono font-bold uppercase tracking-wider hover:bg-champagne-light transition-all shadow-champagne-glow flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Record Expense</span>
            </button>
          </div>
        </div>

        {/* Asymmetric Financial Overview (Dominant Liquid Balance Hero + Supporting Streams) */}
        <BalanceOverview
          income={budgetSummary?.salary || 0}
          expenses={budgetSummary?.totalExpenditure || 0}
          available={budgetSummary?.availableBalance || 0}
          savings={budgetSummary?.actualSavings || 0}
          unallocated={budgetSummary?.unallocated || 0}
        />

        {/* Financial Intelligence Metric Tiles (Subtle Editorial Insights) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Insight 1: Primary Outflow Category */}
          <div className="p-5 rounded-2xl bg-surface/70 border border-bronze/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-background-primary border border-champagne/30 flex items-center justify-center text-champagne shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-typography-muted">
                Peak Outflow Sector
              </div>
              <div className="text-sm font-bold text-ivory font-sans truncate">
                {insights.topCategory.category}
              </div>
              <div className="text-[11px] font-mono text-champagne">
                {insights.topCategory.percentage.toFixed(1)}% of total spent
              </div>
            </div>
          </div>

          {/* Insight 2: Mean Ticket Size */}
          <div className="p-5 rounded-2xl bg-surface/70 border border-bronze/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-background-primary border border-amber/30 flex items-center justify-center text-amber shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-typography-muted">
                Average Ticket Size
              </div>
              <div className="text-sm font-bold font-mono text-ivory">
                {formatINR(insights.avgTicket)}
              </div>
              <div className="text-[11px] font-mono text-typography-secondary">
                Across {insights.count} recorded entries
              </div>
            </div>
          </div>

          {/* Insight 3: Expenditure Velocity */}
          <div className="p-5 rounded-2xl bg-surface/70 border border-bronze/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-background-primary border border-bronze/60 flex items-center justify-center text-typography-secondary shrink-0">
              <Activity className="w-4 h-4 text-champagne" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-typography-muted">
                Ledger Velocity
              </div>
              <div className="text-sm font-bold text-ivory font-sans">
                {insights.count} Transactions
              </div>
              <div className="text-[11px] font-mono text-typography-secondary">
                Active monthly transactions
              </div>
            </div>
          </div>

          {/* Insight 4: Capital Preservation */}
          <div className="p-5 rounded-2xl bg-surface/70 border border-bronze/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-background-primary border border-emerald/30 flex items-center justify-center text-emerald shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-typography-muted">
                Preservation Index
              </div>
              <div className="text-sm font-bold font-mono text-emerald">
                {insights.retentionRate.toFixed(1)}% Retained
              </div>
              <div className="text-[11px] font-mono text-typography-secondary">
                Effective capital conservation
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: 3D Visualization + Distribution Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Left: Signature 3D Extruded Donut Chart (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 p-7 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md relative overflow-hidden flex flex-col justify-between shadow-cinematic">
            <div className="flex items-center justify-between pb-3 border-b border-bronze/40">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-champagne">
                  Sculptural Analytics
                </span>
                <h3 className="text-lg font-bold font-sans text-ivory">
                  3D Capital Distribution
                </h3>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-typography-muted">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                <span>Interactive Three.js Donut</span>
              </div>
            </div>

            {/* 3D Canvas Container */}
            <div className="my-2">
              <ExpensePieChart3D
                data={categories}
                totalSpent={budgetSummary?.totalExpenditure || 0}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-typography-muted pt-3 border-t border-bronze/40">
              <span>Hover to isolate sector • Click to filter ledger</span>
              <span className="text-champagne font-bold">Three.js Engine</span>
            </div>
          </div>

          {/* Right: Distribution Breakdown List (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 p-7 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md flex flex-col justify-between shadow-cinematic">
            <CategoryBreakdown
              data={categories}
              totalSpent={budgetSummary?.totalExpenditure || 0}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Quick link to custom allocation */}
            <div className="pt-4 border-t border-bronze/40 mt-4 flex items-center justify-between">
              <span className="text-[11px] font-mono text-typography-muted">
                Custom Allocations
              </span>
              <Link
                to="/budget"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-champagne hover:text-champagne-light"
              >
                Adjust Allocations <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="p-7 rounded-3xl bg-surface border border-bronze/60 backdrop-blur-md shadow-cinematic">
          <RecentTransactions
            expenses={
              selectedCategory
                ? expenses.filter((e) => e.category === selectedCategory)
                : expenses
            }
            onDeleteExpense={(id) => setDeleteTargetId(id)}
            limit={6}
          />
        </div>
      </div>

      {/* Expense Creation Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={async () => {
          setIsExpenseModalOpen(false);
          await fetchDashboardData();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title={expenseToDelete?.title || 'Selected entry'}
        onConfirm={handleDeleteExpense}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AppShell>
  );
};

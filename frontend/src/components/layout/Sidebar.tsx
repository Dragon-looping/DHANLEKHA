import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Sparkles, 
  LogOut, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { BrandWordmark } from '../branding/BrandWordmark';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onOpenAddExpense?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddExpense }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Command Centre', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Ledger Records', path: '/transactions', icon: ReceiptText },
    { label: 'Custom Allocation', path: '/budget', icon: SlidersHorizontal },
    { label: 'Intelligence & Insights', path: '/insights', icon: Sparkles },
  ];

  return (
    <aside className="w-64 h-screen bg-background-secondary border-r border-bronze/40 flex flex-col justify-between shrink-0 select-none z-30 text-left">
      {/* Top branding */}
      <div className="p-6 border-b border-bronze/40">
        <NavLink to="/dashboard" className="block">
          <BrandWordmark variant="nav" />
        </NavLink>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-widest text-typography-muted px-3 pb-3">
          FINANCIAL WORKSPACE
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-surface-elevated text-champagne border border-champagne/30 shadow-golden-glow font-bold'
                    : 'text-typography-secondary hover:text-ivory hover:bg-surface/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-champagne' : 'text-typography-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-champagne" />}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Action Button */}
        {onOpenAddExpense && (
          <div className="pt-6">
            <button
              onClick={onOpenAddExpense}
              className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-champagne to-amber text-background-primary text-xs font-mono font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-golden-glow flex items-center justify-center gap-2"
            >
              <span>+ Record Expense</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Profile & Sign out */}
      <div className="p-4 border-t border-bronze/40 space-y-3">
        {user && (
          <div className="p-3 rounded-xl bg-surface/50 border border-bronze/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-champagne/30 flex items-center justify-center font-mono font-bold text-champagne text-xs shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-ivory truncate">
                {user.name}
              </div>
              <div className="text-[10px] font-mono text-typography-muted truncate">
                {user.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-typography-secondary hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

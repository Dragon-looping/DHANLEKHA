import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ExpenseModal } from '../expenses/ExpenseModal';
import { X } from 'lucide-react';
import { BrandWordmark } from '../branding/BrandWordmark';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onRefreshData?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title,
  subtitle,
  onRefreshData,
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-background-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar onOpenAddExpense={() => setIsExpenseModalOpen(true)} />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-background-secondary border-r border-bronze/50 z-10 flex flex-col justify-between">
            <div className="p-4 flex items-center justify-between border-b border-bronze/40">
              <BrandWordmark variant="nav" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-typography-muted hover:text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                onOpenAddExpense={() => {
                  setIsMobileMenuOpen(false);
                  setIsExpenseModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          title={title}
          subtitle={subtitle}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddExpense={() => setIsExpenseModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={() => {
          onRefreshData?.();
        }}
      />
    </div>
  );
};

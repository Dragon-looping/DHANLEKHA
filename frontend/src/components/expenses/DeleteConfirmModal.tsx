import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-primary/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-danger/30 shadow-cinematic p-6 space-y-4 text-left">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/25 flex items-center justify-center text-danger">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-ivory font-sans">
            Delete Ledger Entry
          </h3>
          <p className="text-xs text-typography-secondary font-sans mt-1">
            Are you sure you want to permanently remove <span className="text-ivory font-semibold">"{title}"</span> from your expense ledger? This will immediately recalculate your available balance.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-typography-secondary hover:text-ivory hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-danger text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-danger/80 transition-colors shadow-lg flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
};

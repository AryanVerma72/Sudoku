import React from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface RestartConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-2xl text-center">
        {/* Icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
          <RotateCcw className="w-6 h-6" />
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-[#141517] dark:text-[#F1F2F6] mb-1.5">
          Restart Puzzle?
        </h3>
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-5 leading-relaxed">
          Are you sure you want to restart this puzzle? Your current board progress, pencil notes, mistakes, and timer will reset to the beginning.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[#E5E5E2] dark:border-[#2A2C33] text-xs font-semibold text-[#4B5162] dark:text-[#CBD5E1] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

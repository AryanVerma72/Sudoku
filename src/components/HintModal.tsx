import React from 'react';
import { Lightbulb, CheckCircle2, X } from 'lucide-react';
import { HintResult } from '../lib/sudoku';

interface HintModalProps {
  hint: HintResult | null;
  onApplyHint: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ hint, onApplyHint, onClose }) => {
  if (!hint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-3">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-xl animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FEF3C7] dark:bg-[#78350F]/40 text-[#D97706] dark:text-[#FBBF24]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706] dark:text-[#FBBF24]">
                {hint.technique}
              </span>
              <h4 className="text-sm font-bold text-[#141517] dark:text-[#F1F2F6]">
                Row {hint.row + 1}, Column {hint.col + 1}
              </h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation prose */}
        <p className="text-sm text-[#4B5162] dark:text-[#CBD5E1] leading-relaxed mb-4">
          {hint.explanation}
        </p>

        {/* Target value & Action button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F0F0EE] dark:border-[#262830]">
          <div className="text-xs text-[#8C92A4] dark:text-[#646A7E]">
            Suggested value: <span className="text-base font-bold text-[#1E3A8A] dark:text-[#93C5FD] tabular-nums">{hint.value}</span>
          </div>

          <button
            type="button"
            onClick={onApplyHint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A8A] dark:bg-[#2563EB] text-white font-medium text-xs shadow-xs active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply Hint
          </button>
        </div>
      </div>
    </div>
  );
};

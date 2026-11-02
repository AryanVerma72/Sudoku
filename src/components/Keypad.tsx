import React from 'react';
import { triggerHaptic } from '../lib/haptics';

interface KeypadProps {
  onNumberClick: (num: number) => void;
  remainingCounts: Record<number, number>;
  inputMode: 'cell-first' | 'digit-first';
  activeDigit: number | null;
  onSelectDigit: (num: number) => void;
  onToggleInputMode: (mode: 'cell-first' | 'digit-first') => void;
  hapticsEnabled: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onNumberClick,
  remainingCounts,
  inputMode,
  activeDigit,
  onSelectDigit,
  onToggleInputMode,
  hapticsEnabled,
}) => {
  const handleKeyClick = (num: number) => {
    if (hapticsEnabled) triggerHaptic('tap');

    if (inputMode === 'digit-first') {
      // Toggle or switch active digit
      if (activeDigit === num) {
        onSelectDigit(0); // deselect
      } else {
        onSelectDigit(num);
      }
    } else {
      // Cell-first: enter into selected cell
      onNumberClick(num);
    }
  };

  const renderKeyButton = (num: number) => {
    const remaining = remainingCounts[num] ?? 0;
    const isCompleted = remaining === 0;
    const isActive = inputMode === 'digit-first' && activeDigit === num;

    return (
      <button
        key={num}
        type="button"
        onClick={() => handleKeyClick(num)}
        className={`
          relative flex flex-col items-center justify-center h-13 sm:h-14 rounded-xl transition-all duration-100 outline-none
          ${
            isActive
              ? 'bg-[#1E3A8A] text-white ring-2 ring-[#2563EB] shadow-md dark:bg-[#2563EB] scale-105 z-10'
              : isCompleted
              ? 'bg-[#EAEAE8]/60 dark:bg-[#202228]/60 text-[#9CA3AF] dark:text-[#4A5060] opacity-40 cursor-default'
              : 'bg-white dark:bg-[#1A1B1F] text-[#111215] dark:text-[#F1F2F6] border border-[#E5E5E2] dark:border-[#2A2C33] shadow-xs active:scale-95 hover:border-[#CBD5E1] dark:hover:border-[#4B5162]'
          }
        `}
        aria-label={`Digit ${num}, ${remaining} remaining`}
      >
        <span
          className={`text-xl sm:text-2xl font-bold tabular-nums leading-none ${
            isActive ? 'text-white' : ''
          }`}
        >
          {num}
        </span>
        <span
          className={`text-[9px] sm:text-[10px] tabular-nums font-semibold mt-0.5 ${
            isActive
              ? 'text-blue-100'
              : isCompleted
              ? 'text-transparent'
              : 'text-[#8C92A4] dark:text-[#646A7E]'
          }`}
        >
          {isCompleted ? '✓' : remaining}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 pt-1 pb-1 select-none">
      {/* Input Mode Selector Bar */}
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="text-[10px] font-semibold text-[#8C92A4] dark:text-[#646A7E] uppercase tracking-wider">
          Input Mode
        </span>
        <div className="inline-flex p-0.5 rounded-lg bg-[#EAEAE8] dark:bg-[#202228] text-[11px] font-medium">
          <button
            onClick={() => {
              if (hapticsEnabled) triggerHaptic('light');
              onToggleInputMode('cell-first');
            }}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              inputMode === 'cell-first'
                ? 'bg-white dark:bg-[#2B2D35] text-[#141517] dark:text-[#F1F2F6] shadow-2xs font-semibold'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white'
            }`}
          >
            Cell-First
          </button>
          <button
            onClick={() => {
              if (hapticsEnabled) triggerHaptic('light');
              onToggleInputMode('digit-first');
            }}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              inputMode === 'digit-first'
                ? 'bg-white dark:bg-[#2B2D35] text-[#141517] dark:text-[#F1F2F6] shadow-2xs font-semibold'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white'
            }`}
          >
            Digit-First
          </button>
        </div>
      </div>

      {/* 1-9 Number Buttons in Two Bigger Lines */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* Line 1: Numbers 1 to 5 */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map(renderKeyButton)}
        </div>

        {/* Line 2: Numbers 6 to 9 */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 px-5 sm:px-8">
          {[6, 7, 8, 9].map(renderKeyButton)}
        </div>
      </div>
    </div>
  );
};

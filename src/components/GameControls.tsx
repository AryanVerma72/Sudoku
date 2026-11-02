import React from 'react';
import { RotateCcw, Eraser, Edit3, Lightbulb } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface GameControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onErase: () => void;
  isPencilMode: boolean;
  onTogglePencil: () => void;
  onTriggerHint: () => void;
  hintsUsed: number;
  hapticsEnabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  onUndo,
  onErase,
  isPencilMode,
  onTogglePencil,
  onTriggerHint,
  hintsUsed,
  hapticsEnabled,
}) => {
  const handleAction = (fn: () => void, haptic: 'light' | 'tap' | 'hint' = 'tap') => {
    if (hapticsEnabled) triggerHaptic(haptic);
    fn();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-1 flex items-center justify-around select-none">
      {/* Undo Button */}
      <button
        onClick={() => handleAction(onUndo, 'light')}
        disabled={!canUndo}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
          canUndo
            ? 'text-[#141517] dark:text-[#F1F2F6] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95'
            : 'text-[#C4C7D0] dark:text-[#4A5060] cursor-not-allowed'
        }`}
        title="Undo last move (Z)"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-[11px] font-medium tracking-tight">Undo</span>
      </button>

      {/* Erase Button */}
      <button
        onClick={() => handleAction(onErase, 'light')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#141517] dark:text-[#F1F2F6] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-colors"
        title="Erase cell (Backspace)"
      >
        <Eraser className="w-4 h-4" />
        <span className="text-[11px] font-medium tracking-tight">Erase</span>
      </button>

      {/* Pencil / Notes Toggle Button */}
      <button
        onClick={() => handleAction(onTogglePencil, 'tap')}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          isPencilMode
            ? 'bg-[#1E3A8A] text-white shadow-2xs dark:bg-[#3B82F6]'
            : 'text-[#141517] dark:text-[#F1F2F6] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95'
        }`}
        title="Pencil Notes mode (N)"
      >
        <Edit3 className="w-4 h-4" />
        <span className="text-[11px] font-medium tracking-tight">
          {isPencilMode ? 'Notes On' : 'Notes'}
        </span>
      </button>

      {/* Smart Hint Button */}
      <button
        onClick={() => handleAction(onTriggerHint, 'hint')}
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#141517] dark:text-[#F1F2F6] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-colors"
        title="Get a smart deduction hint (H)"
      >
        <div className="relative">
          <Lightbulb className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24]" />
          {hintsUsed > 0 && (
            <span className="absolute -top-1 -right-2 px-1 text-[8px] font-bold rounded-full bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F] dark:text-[#FDE68A] tabular-nums leading-tight">
              {hintsUsed}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium tracking-tight">Hint</span>
      </button>
    </div>
  );
};

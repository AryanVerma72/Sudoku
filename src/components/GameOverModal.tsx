import React from 'react';
import { AlertCircle, RotateCcw, Play, RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface GameOverModalProps {
  onContinueRelaxed: () => void;
  onRestartCurrent: () => void;
  onNewGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onContinueRelaxed,
  onRestartCurrent,
  onNewGame,
}) => {
  React.useEffect(() => {
    triggerHaptic('error');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-6 shadow-2xl text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-[#FEF2F2] dark:bg-[#451A1A] border border-[#FEE2E2] dark:border-[#5C2222] flex items-center justify-center mb-3">
          <AlertCircle className="w-7 h-7 text-[#DC2626] dark:text-[#EF4444]" />
        </div>

        <h3 className="text-xl font-black text-[#141517] dark:text-[#F1F2F6] mb-1">
          3 Mistakes Made
        </h3>
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-5 leading-relaxed">
          You've reached the maximum mistakes limit for this game. Would you like to continue in Relaxed Mode or try again?
        </p>

        {/* Action Choices */}
        <div className="space-y-2.5">
          <button
            onClick={onContinueRelaxed}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E3A8A] dark:bg-[#2563EB] text-white font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Continue in Relaxed Mode</span>
          </button>

          <button
            onClick={onRestartCurrent}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E5E2] dark:border-[#2A2C33] text-[#141517] dark:text-[#F1F2F6] font-medium text-xs hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#8C92A4]" />
            <span>Restart Current Board</span>
          </button>

          <button
            onClick={onNewGame}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E5E2] dark:border-[#2A2C33] text-[#141517] dark:text-[#F1F2F6] font-medium text-xs hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-[#8C92A4]" />
            <span>Start Fresh Puzzle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

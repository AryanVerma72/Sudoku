import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Timer, CheckCircle, Flame, RotateCcw, ArrowRight } from 'lucide-react';
import { Difficulty } from '../lib/sudoku';
import { triggerHaptic } from '../lib/haptics';

interface VictoryModalProps {
  difficulty: Difficulty;
  timeSeconds: number;
  mistakes: number;
  hintsUsed: number;
  isNewBest: boolean;
  streak: number;
  onPlayAgain: () => void;
  onNextDifficulty: () => void;
  onViewStats: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  difficulty,
  timeSeconds,
  mistakes,
  hintsUsed,
  isNewBest,
  streak,
  onPlayAgain,
  onNextDifficulty,
  onViewStats,
}) => {
  useEffect(() => {
    triggerHaptic('win');
    // Multi-stage confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#1E3A8A', '#2563EB', '#D97706', '#15803D', '#F59E0B'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // Ignore if canvas-confetti is unavailable
    }
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-6 shadow-2xl text-center">
        {/* Trophy Emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 border border-[#FDE68A] dark:border-[#92400E] flex items-center justify-center mb-3">
          <Trophy className="w-8 h-8 text-[#D97706] dark:text-[#FBBF24]" />
        </div>

        <h3 className="text-2xl font-black text-[#141517] dark:text-[#F1F2F6] mb-1">
          Puzzle Solved!
        </h3>
        <p className="text-xs text-[#8C92A4] dark:text-[#646A7E] uppercase font-semibold tracking-wider mb-4">
          {difficulty === 'daily' ? 'Daily Challenge Complete' : `${difficulty} Level Complete`}
        </p>

        {/* New Best Time Recognition */}
        {isNewBest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7EE] dark:bg-[#142E1B] text-[#15803D] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#1E4D29] text-xs font-bold mb-4 animate-bounce">
            <CheckCircle className="w-3.5 h-3.5" />
            New Personal Best Record!
          </div>
        )}

        {/* Daily Streak Badge */}
        {difficulty === 'daily' && streak > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-4 text-xs font-bold text-[#EA580C] dark:text-[#FB923C]">
            <Flame className="w-4 h-4" />
            <span>Daily Streak: {streak} {streak === 1 ? 'Day' : 'Days'}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830] mb-5">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#8C92A4] dark:text-[#646A7E]">
              Time
            </div>
            <div className="text-base font-extrabold font-mono tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {formatTime(timeSeconds)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#8C92A4] dark:text-[#646A7E]">
              Mistakes
            </div>
            <div className="text-base font-extrabold tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {mistakes}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#8C92A4] dark:text-[#646A7E]">
              Hints Used
            </div>
            <div className="text-base font-extrabold tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {hintsUsed}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {difficulty !== 'expert' && difficulty !== 'daily' && (
            <button
              onClick={onNextDifficulty}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E3A8A] dark:bg-[#2563EB] text-white font-semibold text-sm shadow-md active:scale-95 transition-all"
            >
              <span>Next Difficulty</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111215] dark:bg-[#F1F2F6] text-white dark:text-[#111215] font-semibold text-sm shadow-md active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Another Puzzle</span>
          </button>

          <button
            onClick={onViewStats}
            className="w-full py-2 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111215] dark:hover:text-white transition-colors"
          >
            View Lifetime Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

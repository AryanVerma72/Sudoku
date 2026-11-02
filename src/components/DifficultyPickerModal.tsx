import React from 'react';
import { X, Sparkles, Zap, Flame, ShieldAlert, Calendar } from 'lucide-react';
import { Difficulty } from '../lib/sudoku';

interface DifficultyPickerModalProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  onClose: () => void;
  hasGameInProgress: boolean;
}

export const DifficultyPickerModal: React.FC<DifficultyPickerModalProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  onClose,
  hasGameInProgress,
}) => {
  const levels: {
    key: Difficulty;
    title: string;
    clues: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'easy',
      title: 'Easy',
      clues: '~38 Clues',
      desc: 'Ideal for beginners and quick warmups.',
      icon: <Sparkles className="w-5 h-5 text-[#15803D]" />,
    },
    {
      key: 'medium',
      title: 'Medium',
      clues: '~32 Clues',
      desc: 'Balanced logic requiring candidate tracking.',
      icon: <Zap className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      key: 'hard',
      title: 'Hard',
      clues: '~27 Clues',
      desc: 'Deep deductive reasoning and hidden singles.',
      icon: <Flame className="w-5 h-5 text-[#EA580C]" />,
    },
    {
      key: 'expert',
      title: 'Expert',
      clues: '~23 Clues',
      desc: 'Master-level deduction for seasoned solvers.',
      icon: <ShieldAlert className="w-5 h-5 text-[#DC2626]" />,
    },
    {
      key: 'daily',
      title: 'Daily Challenge',
      clues: 'Today’s Puzzle',
      desc: 'A unique synchronized daily puzzle with streak badges.',
      icon: <Calendar className="w-5 h-5 text-[#D97706]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EE] dark:border-[#262830]">
          <h3 className="text-base font-bold text-[#141517] dark:text-[#F1F2F6]">
            Select Difficulty
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasGameInProgress && (
          <div className="my-3 p-2.5 rounded-xl bg-[#FEF2F2] dark:bg-[#381616] border border-[#FEE2E2] dark:border-[#522020] text-xs text-[#DC2626] dark:text-[#FCA5A5]">
            Starting a new game will reset your current board progress.
          </div>
        )}

        <div className="space-y-2 my-3">
          {levels.map((lvl) => {
            const isSelected = currentDifficulty === lvl.key;

            return (
              <button
                key={lvl.key}
                onClick={() => {
                  onSelectDifficulty(lvl.key);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98]
                  ${
                    isSelected
                      ? 'bg-[#F4F6FB] dark:bg-[#1E2536] border-[#2563EB] dark:border-[#3B82F6]'
                      : 'bg-white dark:bg-[#15171C] border-[#E5E5E2] dark:border-[#262830] hover:border-[#CBD5E1] dark:hover:border-[#4B5162]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    {lvl.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#141517] dark:text-[#F1F2F6]">
                        {lvl.title}
                      </span>
                      <span className="text-[10px] text-[#8C92A4] dark:text-[#646A7E] font-medium">
                        {lvl.clues}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                      {lvl.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

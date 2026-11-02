import React from 'react';
import { Pause, Play, Calendar, Trophy, Settings, Sun, Moon, Sparkles, RotateCcw } from 'lucide-react';
import { Difficulty } from '../lib/sudoku';

interface HeaderHUDProps {
  difficulty: Difficulty;
  dateStr?: string;
  mistakes: number;
  maxMistakes: number | null;
  relaxedMode: boolean;
  timer: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenDaily: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onNewGameClick: () => void;
  onRestartClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  difficulty,
  dateStr,
  mistakes,
  maxMistakes,
  relaxedMode,
  timer,
  isPaused,
  onTogglePause,
  onOpenDaily,
  onOpenStats,
  onOpenSettings,
  onNewGameClick,
  onRestartClick,
  theme,
  onToggleTheme,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const difficultyNames: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    daily: dateStr ? `Daily · ${dateStr.slice(5)}` : 'Daily',
  };

  return (
    <header className="w-full max-w-md mx-auto pt-1 pb-0.5 px-3 select-none">
      {/* Top Brand Bar & Global Utilities */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <h1 className="text-lg font-extrabold tracking-tight text-[#141517] dark:text-[#F1F2F6] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#111215] dark:bg-[#F1F2F6]"></span>
            ZenSudoku
          </h1>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Daily Challenge shortcut */}
          <button
            onClick={onOpenDaily}
            title="Daily Challenge Calendar"
            className="p-1.5 rounded-lg text-[#4B5162] hover:text-[#111215] dark:text-[#9CA3AF] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Daily Challenge"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Statistics shortcut */}
          <button
            onClick={onOpenStats}
            title="Statistics"
            className="p-1.5 rounded-lg text-[#4B5162] hover:text-[#111215] dark:text-[#9CA3AF] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Statistics"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Paper Light' : 'Switch to Sumi Dark'}
            className="p-1.5 rounded-lg text-[#4B5162] hover:text-[#111215] dark:text-[#9CA3AF] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings shortcut */}
          <button
            onClick={onOpenSettings}
            title="Settings & How to Play"
            className="p-1.5 rounded-lg text-[#4B5162] hover:text-[#111215] dark:text-[#9CA3AF] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game HUD Bar: Difficulty, Mistakes, Timer */}
      <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] shadow-xs text-xs font-medium text-[#4B5162] dark:text-[#9CA3AF]">
        {/* Difficulty badge & New Game prompt */}
        <button
          onClick={onNewGameClick}
          className="flex items-center gap-1.5 hover:text-[#111215] dark:hover:text-white font-semibold transition-colors"
          title="Change difficulty level"
        >
          <span className="capitalize">{difficultyNames[difficulty]}</span>
          <span className="text-[10px] text-[#8C92A4] dark:text-[#646A7E]">▾</span>
        </button>

        {/* Mistake Counter */}
        <div className="flex items-center gap-1">
          <span className="text-[#8C92A4] dark:text-[#646A7E]">Mistakes:</span>
          <span
            className={`font-semibold tabular-nums ${
              mistakes > 0
                ? 'text-[#DC2626] dark:text-[#EF4444]'
                : 'text-[#141517] dark:text-[#F1F2F6]'
            }`}
          >
            {relaxedMode || maxMistakes === null ? mistakes : `${mistakes}/${maxMistakes}`}
          </span>
          {relaxedMode && (
            <span className="text-[10px] text-[#8C92A4] dark:text-[#646A7E] font-normal">(Free)</span>
          )}
        </div>

        {/* Timer & Pause/Resume */}
        <button
          onClick={onTogglePause}
          className="flex items-center gap-1.5 font-mono font-medium hover:text-[#111215] dark:hover:text-white transition-colors pl-1"
          title={isPaused ? 'Resume Game' : 'Pause Game'}
        >
          <span className="tabular-nums text-sm text-[#141517] dark:text-[#F1F2F6]">{formatTime(timer)}</span>
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-[#8C92A4] dark:text-[#646A7E]" />
          )}
        </button>
      </div>

      {/* Restart Button positioned directly below the difficulty, mistake, and time section */}
      <div className="flex items-center justify-start px-0.5 pt-1.5">
        <button
          onClick={onRestartClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#4B5162] dark:text-[#9CA3AF] hover:text-[#111215] dark:hover:text-white bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] shadow-2xs hover:border-[#CBD5E1] dark:hover:border-[#4B5162] active:scale-95 transition-all"
          title="Restart this puzzle from beginning"
        >
          <RotateCcw className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA]" />
          <span>Restart</span>
        </button>
      </div>
    </header>
  );
};

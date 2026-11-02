import React, { useState } from 'react';
import { X, Trophy, Timer, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import { Difficulty } from '../lib/sudoku';
import { StatisticsData } from '../lib/storage';

interface StatsModalProps {
  stats: StatisticsData;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const [activeTab, setActiveTab] = useState<Difficulty>('medium');

  const formatTime = (secs: number | null) => {
    if (secs === null || secs === 0) return '--:--';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentStat = stats[activeTab] || {
    gamesStarted: 0,
    gamesWon: 0,
    bestTime: null,
    totalTime: 0,
  };

  const winRate =
    currentStat.gamesStarted > 0
      ? Math.round((currentStat.gamesWon / currentStat.gamesStarted) * 100)
      : 0;

  const avgTime =
    currentStat.gamesWon > 0
      ? Math.round(currentStat.totalTime / currentStat.gamesWon)
      : null;

  const tabs: { key: Difficulty; label: string }[] = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
    { key: 'expert', label: 'Expert' },
    { key: 'daily', label: 'Daily' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EE] dark:border-[#262830]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D97706]" />
            <h3 className="text-base font-bold text-[#141517] dark:text-[#F1F2F6]">
              Statistics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Segmented Tabs */}
        <div className="flex items-center justify-between p-1 my-3 rounded-xl bg-[#F4F4F2] dark:bg-[#121316] text-xs font-medium">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-[#252830] text-[#141517] dark:text-white shadow-xs font-semibold'
                  : 'text-[#6B7280] dark:text-[#8C92A4] hover:text-[#141517] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          <div className="p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C92A4] dark:text-[#646A7E] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              Games Won
            </div>
            <div className="text-2xl font-black tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {currentStat.gamesWon}{' '}
              <span className="text-xs font-normal text-[#8C92A4] dark:text-[#646A7E]">
                / {currentStat.gamesStarted}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C92A4] dark:text-[#646A7E] mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
              Win Rate
            </div>
            <div className="text-2xl font-black tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {winRate}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C92A4] dark:text-[#646A7E] mb-1">
              <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
              Best Time
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {formatTime(currentStat.bestTime)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C92A4] dark:text-[#646A7E] mb-1">
              <Timer className="w-3.5 h-3.5 text-[#6B7280]" />
              Average Time
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-[#141517] dark:text-[#F1F2F6]">
              {formatTime(avgTime)}
            </div>
          </div>
        </div>

        {/* Daily Streak Highlight if on Daily Tab */}
        {activeTab === 'daily' && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF7ED] dark:bg-[#2D1B11] border border-[#FFEDD5] dark:border-[#432313] mt-2 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#EA580C]" />
              <span className="font-semibold text-[#9A3412] dark:text-[#FDBA74]">Current Streak</span>
            </div>
            <span className="font-black tabular-nums text-[#9A3412] dark:text-[#FDBA74]">
              {stats.currentStreak} Days (Best: {stats.maxStreak})
            </span>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-[#F0F0EE] dark:border-[#262830]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#111215] dark:bg-[#F1F2F6] text-white dark:text-[#111215] font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

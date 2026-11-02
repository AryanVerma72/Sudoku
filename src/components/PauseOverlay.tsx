import React from 'react';
import { Play } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  timer: number;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, timer }) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F8F8F6]/90 dark:bg-[#121316]/90 backdrop-blur-md rounded-2xl select-none p-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] shadow-md flex items-center justify-center mb-4">
        <Play className="w-6 h-6 text-[#141517] dark:text-[#F1F2F6] ml-1" />
      </div>

      <h3 className="text-xl font-bold text-[#141517] dark:text-[#F1F2F6] mb-1">
        Game Paused
      </h3>
      <p className="text-sm font-mono text-[#6B7280] dark:text-[#9CA3AF] mb-6">
        Current Time: {formatTime(timer)}
      </p>

      <button
        type="button"
        onClick={onResume}
        className="w-full max-w-[200px] py-3 px-6 rounded-xl bg-[#111215] dark:bg-[#F1F2F6] text-white dark:text-[#111215] font-semibold text-sm shadow-md active:scale-95 transition-all"
      >
        Resume Game
      </button>
    </div>
  );
};

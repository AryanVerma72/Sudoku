import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Award, Flame } from 'lucide-react';

interface DailyCalendarModalProps {
  completedDates: string[];
  currentStreak: number;
  maxStreak: number;
  onSelectDate: (dateStr: string) => void;
  onClose: () => void;
  selectedDateStr: string;
}

export const DailyCalendarModal: React.FC<DailyCalendarModalProps> = ({
  completedDates,
  currentStreak,
  maxStreak,
  onSelectDate,
  onClose,
  selectedDateStr,
}) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EE] dark:border-[#262830]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#111215] dark:text-[#F1F2F6]" />
            <h3 className="text-base font-bold text-[#141517] dark:text-[#F1F2F6]">
              Daily Challenge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streaks Banner */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830]">
            <Flame className="w-5 h-5 text-[#EA580C]" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#8C92A4] dark:text-[#646A7E]">
                Streak
              </div>
              <div className="text-base font-extrabold tabular-nums text-[#141517] dark:text-[#F1F2F6]">
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830]">
            <Award className="w-5 h-5 text-[#D97706]" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#8C92A4] dark:text-[#646A7E]">
                Best Streak
              </div>
              <div className="text-base font-extrabold tabular-nums text-[#141517] dark:text-[#F1F2F6]">
                {maxStreak} Days
              </div>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between my-2 px-1">
          <span className="text-sm font-bold text-[#141517] dark:text-[#F1F2F6]">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-[#6B7280] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-md text-[#6B7280] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-[#8C92A4] dark:text-[#646A7E] mb-1">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty spacer cells before 1st of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {daysArray.map((day) => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
              day
            ).padStart(2, '0')}`;
            const isCompleted = completedDates.includes(dateStr);
            const isToday = dateStr === todayStr;
            const isFuture = dateStr > todayStr;
            const isCurrentSelected = dateStr === selectedDateStr;

            return (
              <button
                key={day}
                disabled={isFuture}
                onClick={() => {
                  onSelectDate(dateStr);
                  onClose();
                }}
                className={`
                  relative flex flex-col items-center justify-center h-9 rounded-lg text-xs font-semibold tabular-nums transition-all
                  ${
                    isFuture
                      ? 'text-[#C4C7D0] dark:text-[#4A5060] cursor-not-allowed'
                      : isCurrentSelected
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-[#EBF7EE] dark:bg-[#142E1B] text-[#15803D] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#1E4D29]'
                      : isToday
                      ? 'border-2 border-[#1E3A8A] dark:border-[#60A5FA] text-[#141517] dark:text-white'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#141517] dark:text-[#F1F2F6]'
                  }
                `}
              >
                <span>{day}</span>
                {isCompleted && (
                  <span className="text-[8px] leading-none text-[#15803D] dark:text-[#4ADE80]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Play Today Action */}
        <div className="mt-4 pt-3 border-t border-[#F0F0EE] dark:border-[#262830]">
          <button
            onClick={() => {
              onSelectDate(todayStr);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#111215] dark:bg-[#F1F2F6] text-white dark:text-[#111215] font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            Play Today's Challenge ({todayStr})
          </button>
        </div>
      </div>
    </div>
  );
};

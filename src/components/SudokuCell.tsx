import React from 'react';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  isInitial: boolean;
  isError: boolean;
  isSelected: boolean;
  isHighlighted: boolean; // Same digit as selected
  isRelated: boolean; // Same row, column, or 3x3 box
  isHintTarget: boolean;
  notes: number[];
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  col,
  value,
  isInitial,
  isError,
  isSelected,
  isHighlighted,
  isRelated,
  isHintTarget,
  notes,
  onClick,
}) => {
  // Border thickness based on 3x3 box boundaries
  const borderRight = (col + 1) % 3 === 0 && col !== 8;
  const borderBottom = (row + 1) % 3 === 0 && row !== 8;

  // Background priority:
  // 1. Error: Soft coral red
  // 2. Selected cell: Primary focus tone
  // 3. Highlighted (same digit): Distinct accent tint
  // 4. Related (crosshairs): Subtle quiet tint
  // 5. Default: Clean white or dark card surface
  let bgClass = 'bg-white dark:bg-[#1A1B1F]';
  if (isError) {
    bgClass = 'bg-[#FEE2E2] dark:bg-[#451A1A] animate-pulse';
  } else if (isSelected) {
    bgClass = 'bg-[#DCE6F8] dark:bg-[#2A3B5C] shadow-inner';
  } else if (isHighlighted && value !== 0) {
    bgClass = 'bg-[#EAF1FC] dark:bg-[#20293A]';
  } else if (isRelated) {
    bgClass = 'bg-[#F5F6F8] dark:bg-[#15171C]';
  }

  // Text color priority
  let textClass = '';
  if (isError) {
    textClass = 'text-[#DC2626] dark:text-[#EF4444] font-bold';
  } else if (isInitial) {
    textClass = 'text-[#111215] dark:text-[#F3F4F6] font-bold';
  } else {
    // Player entered number
    textClass = 'text-[#1E3A8A] dark:text-[#93C5FD] font-semibold';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cell Row ${row + 1}, Column ${col + 1}${value ? `, value ${value}` : ''}`}
      className={`
        relative flex items-center justify-center aspect-square select-none transition-colors duration-100 outline-none
        ${bgClass}
        ${borderRight ? 'border-r-2 border-r-[#2B2D31] dark:border-r-[#4B5162]' : 'border-r border-r-[#E5E5E2] dark:border-r-[#262830]'}
        ${borderBottom ? 'border-b-2 border-b-[#2B2D31] dark:border-b-[#4B5162]' : 'border-b border-b-[#E5E5E2] dark:border-b-[#262830]'}
        ${isSelected ? 'ring-2 ring-inset ring-[#2563EB] dark:ring-[#60A5FA] z-10' : ''}
        ${isHintTarget ? 'ring-2 ring-inset ring-[#F59E0B] dark:ring-[#FBBF24] z-10 animate-pulse' : ''}
      `}
    >
      {value !== 0 ? (
        <span className={`text-lg sm:text-xl tabular-nums leading-none ${textClass}`}>
          {value}
        </span>
      ) : notes && notes.length > 0 ? (
        /* 3x3 Mini Grid for Pencil Candidate Notes */
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              key={num}
              className="flex items-center justify-center text-[9px] sm:text-[10px] leading-none font-medium tabular-nums text-[#6B7280] dark:text-[#9CA3AF]"
            >
              {notes.includes(num) ? num : ''}
            </div>
          ))}
        </div>
      ) : null}
    </button>
  );
};

import React, { useEffect, useCallback } from 'react';
import { Grid } from '../lib/sudoku';
import { SudokuCell } from './SudokuCell';
import { triggerHaptic } from '../lib/haptics';

interface SudokuBoardProps {
  currentGrid: Grid;
  initialGrid: Grid;
  solution: Grid;
  notes: Record<string, number[]>;
  selectedCell: [number, number] | null;
  onSelectCell: (row: number, col: number) => void;
  onNumberInput: (num: number) => void;
  onErase: () => void;
  onTogglePencil: () => void;
  onTriggerHint: () => void;
  inputMode: 'cell-first' | 'digit-first';
  activeDigit: number | null;
  hintTarget: [number, number] | null;
  highlightMatching: boolean;
  highlightCrosshairs: boolean;
  hapticsEnabled: boolean;
  isPaused: boolean;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  currentGrid,
  initialGrid,
  solution,
  notes,
  selectedCell,
  onSelectCell,
  onNumberInput,
  onErase,
  onTogglePencil,
  onTriggerHint,
  inputMode,
  activeDigit,
  hintTarget,
  highlightMatching,
  highlightCrosshairs,
  hapticsEnabled,
  isPaused,
}) => {
  const [selectedRow, selectedCol] = selectedCell || [-1, -1];
  const selectedValue =
    selectedRow >= 0 && selectedCol >= 0 ? currentGrid[selectedRow][selectedCol] : 0;

  // Active highlighted value for matching instances:
  // In digit-first mode, if a digit is active on keypad, highlight all instances of that digit!
  // In cell-first mode, highlight instances of the selected cell's value.
  const targetHighlightDigit =
    inputMode === 'digit-first' && activeDigit !== null
      ? activeDigit
      : selectedValue;

  // Handle cell click
  const handleCellClick = (r: number, c: number) => {
    if (isPaused) return;

    if (hapticsEnabled) {
      triggerHaptic('light');
    }

    if (inputMode === 'digit-first' && activeDigit !== null) {
      // In Digit-First mode, first select the cell, then stamp the active digit
      onSelectCell(r, c);
      onNumberInput(activeDigit);
    } else {
      // Cell-First mode: standard selection
      onSelectCell(r, c);
    }
  };

  // Keyboard navigation listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isPaused) return;

      // Number keys 1-9
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        onNumberInput(parseInt(e.key, 10));
        return;
      }

      // Erase / Backspace
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault();
        onErase();
        return;
      }

      // Pencil toggle shortcut 'n'
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onTogglePencil();
        return;
      }

      // Hint shortcut 'h'
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        onTriggerHint();
        return;
      }

      // Arrow keys navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        let curR = selectedRow >= 0 ? selectedRow : 0;
        let curC = selectedCol >= 0 ? selectedCol : 0;

        if (e.key === 'ArrowUp') curR = (curR - 1 + 9) % 9;
        if (e.key === 'ArrowDown') curR = (curR + 1) % 9;
        if (e.key === 'ArrowLeft') curC = (curC - 1 + 9) % 9;
        if (e.key === 'ArrowRight') curC = (curC + 1) % 9;

        onSelectCell(curR, curC);
      }
    },
    [isPaused, selectedRow, selectedCol, onNumberInput, onErase, onTogglePencil, onTriggerHint, onSelectCell]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full max-w-[340px] sm:max-w-[370px] mx-auto p-1">
      <div className="relative w-full aspect-square bg-white dark:bg-[#1A1B1F] rounded-2xl shadow-sm border-2 border-[#2B2D31] dark:border-[#4B5162] overflow-hidden select-none">
        <div className="grid grid-cols-9 grid-rows-9 w-full h-full">
          {currentGrid.map((rowArr, r) =>
            rowArr.map((val, c) => {
              const cellKey = `${r},${c}`;
              const cellNotes = notes[cellKey] || [];
              const isInitial = initialGrid[r][c] !== 0;
              const isError = val !== 0 && !isInitial && val !== solution[r][c];
              const isSelected = r === selectedRow && c === selectedCol;

              // Check if matching target digit
              const isHighlighted =
                highlightMatching &&
                targetHighlightDigit > 0 &&
                val === targetHighlightDigit;

              // Check if in same row, column, or 3x3 block
              const isRelated =
                highlightCrosshairs &&
                selectedRow >= 0 &&
                selectedCol >= 0 &&
                !isSelected &&
                (r === selectedRow ||
                  c === selectedCol ||
                  (Math.floor(r / 3) === Math.floor(selectedRow / 3) &&
                    Math.floor(c / 3) === Math.floor(selectedCol / 3)));

              const isHintTarget =
                hintTarget !== null && hintTarget[0] === r && hintTarget[1] === c;

              return (
                <SudokuCell
                  key={cellKey}
                  row={r}
                  col={c}
                  value={val}
                  isInitial={isInitial}
                  isError={isError}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  isRelated={isRelated}
                  isHintTarget={isHintTarget}
                  notes={cellNotes}
                  onClick={() => handleCellClick(r, c)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

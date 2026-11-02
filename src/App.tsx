/**
 * ZenSudoku Android - Main Application Root
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Difficulty,
  Grid,
  generateSudoku,
  getSmartHint,
  isBoardComplete,
  getRemainingCounts,
  cloneGrid,
  HintResult,
} from './lib/sudoku';
import {
  SavedGameState,
  MoveHistoryItem,
  loadSavedGame,
  saveCurrentGame,
  loadStatistics,
  recordGameStart,
  recordGameWin,
  loadPreferences,
  savePreferences,
  PlayerPreferences,
} from './lib/storage';
import { HeaderHUD } from './components/HeaderHUD';
import { SudokuBoard } from './components/SudokuBoard';
import { GameControls } from './components/GameControls';
import { Keypad } from './components/Keypad';
import { PauseOverlay } from './components/PauseOverlay';
import { HintModal } from './components/HintModal';
import { DailyCalendarModal } from './components/DailyCalendarModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { DifficultyPickerModal } from './components/DifficultyPickerModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { BottomAdBanner } from './components/BottomAdBanner';
import { PlayStorePublishModal } from './components/PlayStorePublishModal';
import { RestartConfirmModal } from './components/RestartConfirmModal';
import { triggerHaptic } from './lib/haptics';

export default function App() {
  // Global Preferences & Lifetime Stats
  const [preferences, setPreferences] = useState<PlayerPreferences>(loadPreferences);
  const [stats, setStats] = useState(loadStatistics);

  // Active Game State
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [dateStr, setDateStr] = useState<string>(''); // For daily challenge
  const [initialGrid, setInitialGrid] = useState<Grid>(() => Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [solution, setSolution] = useState<Grid>(() => Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [userGrid, setUserGrid] = useState<Grid>(() => Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [activeDigit, setActiveDigit] = useState<number | null>(null);
  const [isPencilMode, setIsPencilMode] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [winStreak, setWinStreak] = useState<number>(0);
  const [history, setHistory] = useState<MoveHistoryItem[]>([]);

  // Modals & Popovers
  const [showDifficultyPicker, setShowDifficultyPicker] = useState<boolean>(false);
  const [showDailyCalendar, setShowDailyCalendar] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showPlayStoreGuide, setShowPlayStoreGuide] = useState<boolean>(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);

  // Sync theme to <html> element and meta tag
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const themeColorMeta = document.getElementById('theme-color-meta');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', preferences.theme === 'dark' ? '#121316' : '#F8F8F6');
    }
    savePreferences(preferences);
  }, [preferences]);

  // Start fresh game helper
  const startNewGame = useCallback(
    (targetDifficulty: Difficulty, customDate?: string) => {
      const today = new Date().toISOString().split('T')[0];
      const actualDate = targetDifficulty === 'daily' ? customDate || today : '';

      const { initialGrid: newInit, solution: newSol } = generateSudoku(
        targetDifficulty,
        actualDate || undefined
      );

      setDifficulty(targetDifficulty);
      setDateStr(actualDate);
      setInitialGrid(newInit);
      setSolution(newSol);
      setUserGrid(cloneGrid(newInit));
      setNotes({});
      setSelectedCell(null);
      setActiveDigit(null);
      setIsPencilMode(false);
      setMistakes(0);
      setHintsUsed(0);
      setTimer(0);
      setIsPaused(false);
      setIsVictory(false);
      setIsGameOver(false);
      setIsNewBest(false);
      setHistory([]);
      setActiveHint(null);

      recordGameStart(targetDifficulty);
      setStats(loadStatistics());
    },
    []
  );

  // Initial load: restore saved game or start fresh
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const saved = loadSavedGame();
    if (saved && !saved.isCompleted) {
      setDifficulty(saved.difficulty);
      setDateStr(saved.dateStr || '');
      setInitialGrid(saved.initialGrid);
      setSolution(saved.solution);
      setUserGrid(saved.userGrid);
      setNotes(saved.notes || {});
      setMistakes(saved.mistakes || 0);
      setHintsUsed(saved.hintsUsed || 0);
      setTimer(saved.timer || 0);
      setIsPaused(saved.isPaused || false);
      setHistory(saved.history || []);
    } else {
      startNewGame('medium');
    }
  }, [startNewGame]);

  // Persist game state on changes
  useEffect(() => {
    if (initialGrid[0][0] === 0 && solution[0][0] === 0) return; // not ready yet
    if (isVictory) {
      saveCurrentGame(null); // clear saved game upon victory
      return;
    }

    const stateToSave: SavedGameState = {
      id: `game_${difficulty}_${dateStr || 'regular'}`,
      difficulty,
      dateStr,
      initialGrid,
      solution,
      userGrid,
      notes,
      mistakes,
      maxMistakes: preferences.relaxedMode ? null : 3,
      timer,
      isCompleted: isVictory,
      isPaused,
      history,
      hintsUsed,
    };
    saveCurrentGame(stateToSave);
  }, [
    difficulty,
    dateStr,
    initialGrid,
    solution,
    userGrid,
    notes,
    mistakes,
    preferences.relaxedMode,
    timer,
    isVictory,
    isPaused,
    history,
    hintsUsed,
  ]);

  // Timer Tick
  useEffect(() => {
    if (isPaused || isVictory || isGameOver) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isVictory, isGameOver]);

  // User input handler (Cell-First & Digit-First)
  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell || isPaused || isVictory || isGameOver) return;
      const [r, c] = selectedCell;

      // Cannot modify initial given clues
      if (initialGrid[r][c] !== 0) {
        if (preferences.hapticsEnabled) triggerHaptic('light');
        return;
      }

      const cellKey = `${r},${c}`;
      const currentCellVal = userGrid[r][c];
      const currentCellNotes = notes[cellKey] || [];

      // Case 1: Pencil (Notes) Mode
      if (isPencilMode) {
        if (preferences.hapticsEnabled) triggerHaptic('tap');
        let newNotesList: number[];
        if (currentCellNotes.includes(num)) {
          newNotesList = currentCellNotes.filter((n) => n !== num);
        } else {
          newNotesList = [...currentCellNotes, num].sort((a, b) => a - b);
        }

        const newNotesMap = { ...notes, [cellKey]: newNotesList };
        setNotes(newNotesMap);

        // Record history
        setHistory((prev) => [
          ...prev,
          {
            row: r,
            col: c,
            prevValue: currentCellVal,
            newValue: currentCellVal,
            prevNotes: currentCellNotes,
            newNotes: newNotesList,
          },
        ]);
        return;
      }

      // Case 2: Placing or Clearing Value
      // If tapping the exact same number, clear it
      if (currentCellVal === num) {
        const nextGrid = cloneGrid(userGrid);
        nextGrid[r][c] = 0;
        setUserGrid(nextGrid);
        setHistory((prev) => [
          ...prev,
          {
            row: r,
            col: c,
            prevValue: currentCellVal,
            newValue: 0,
            prevNotes: currentCellNotes,
            newNotes: currentCellNotes,
          },
        ]);
        return;
      }

      // Check correctness against precomputed solution
      const isCorrect = num === solution[r][c];
      const nextGrid = cloneGrid(userGrid);
      nextGrid[r][c] = num;
      setUserGrid(nextGrid);

      // Handle Notes cleanup in row, column, and 3x3 box
      let nextNotes = { ...notes };
      delete nextNotes[cellKey];

      if (isCorrect && preferences.autoClearNotes) {
        const boxR = Math.floor(r / 3) * 3;
        const boxC = Math.floor(c / 3) * 3;
        for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
          for (let colIdx = 0; colIdx < 9; colIdx++) {
            const isSameRow = rowIdx === r;
            const isSameCol = colIdx === c;
            const isSameBox =
              rowIdx >= boxR && rowIdx < boxR + 3 && colIdx >= boxC && colIdx < boxC + 3;

            if (isSameRow || isSameCol || isSameBox) {
              const k = `${rowIdx},${colIdx}`;
              if (nextNotes[k]) {
                nextNotes[k] = nextNotes[k].filter((cand) => cand !== num);
              }
            }
          }
        }
      }
      setNotes(nextNotes);

      // Record move history
      setHistory((prev) => [
        ...prev,
        {
          row: r,
          col: c,
          prevValue: currentCellVal,
          newValue: num,
          prevNotes: currentCellNotes,
          newNotes: [],
        },
      ]);

      if (isCorrect) {
        if (preferences.hapticsEnabled) triggerHaptic('tap');
        // Check victory
        if (isBoardComplete(nextGrid, solution)) {
          const result = recordGameWin(difficulty, timer, dateStr);
          setIsVictory(true);
          setIsNewBest(result.isNewBest);
          setWinStreak(result.streak);
          setStats(loadStatistics());
        }
      } else {
        // Mistake!
        if (preferences.hapticsEnabled) triggerHaptic('error');
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);

        if (!preferences.relaxedMode && nextMistakes >= 3) {
          setIsGameOver(true);
        }
      }
    },
    [
      selectedCell,
      isPaused,
      isVictory,
      isGameOver,
      initialGrid,
      userGrid,
      solution,
      notes,
      isPencilMode,
      preferences,
      mistakes,
      difficulty,
      timer,
      dateStr,
    ]
  );

  // Erase action
  const handleErase = useCallback(() => {
    if (!selectedCell || isPaused || isVictory || isGameOver) return;
    const [r, c] = selectedCell;

    if (initialGrid[r][c] !== 0) return;

    const cellKey = `${r},${c}`;
    const prevVal = userGrid[r][c];
    const prevNotes = notes[cellKey] || [];

    if (prevVal === 0 && prevNotes.length === 0) return;

    const nextGrid = cloneGrid(userGrid);
    nextGrid[r][c] = 0;
    setUserGrid(nextGrid);

    const nextNotes = { ...notes };
    delete nextNotes[cellKey];
    setNotes(nextNotes);

    setHistory((prev) => [
      ...prev,
      {
        row: r,
        col: c,
        prevValue: prevVal,
        newValue: 0,
        prevNotes: prevNotes,
        newNotes: [],
      },
    ]);
  }, [selectedCell, isPaused, isVictory, isGameOver, initialGrid, userGrid, notes]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isPaused || isVictory || isGameOver) return;

    const lastMove = history[history.length - 1];
    const nextHistory = history.slice(0, -1);
    setHistory(nextHistory);

    const nextGrid = cloneGrid(userGrid);
    nextGrid[lastMove.row][lastMove.col] = lastMove.prevValue;
    setUserGrid(nextGrid);

    const cellKey = `${lastMove.row},${lastMove.col}`;
    const nextNotes = { ...notes };
    if (lastMove.prevNotes.length > 0) {
      nextNotes[cellKey] = lastMove.prevNotes;
    } else {
      delete nextNotes[cellKey];
    }
    setNotes(nextNotes);

    setSelectedCell([lastMove.row, lastMove.col]);
  }, [history, isPaused, isVictory, isGameOver, userGrid, notes]);

  // Smart Hint trigger
  const handleTriggerHint = () => {
    if (isPaused || isVictory || isGameOver) return;
    const hint = getSmartHint(userGrid, initialGrid, solution);
    if (hint) {
      setActiveHint(hint);
      setSelectedCell([hint.row, hint.col]);
    }
  };

  // Apply Smart Hint
  const handleApplyHint = () => {
    if (!activeHint) return;
    const { row, col, value } = activeHint;

    const nextGrid = cloneGrid(userGrid);
    nextGrid[row][col] = value;
    setUserGrid(nextGrid);

    const cellKey = `${row},${col}`;
    const nextNotes = { ...notes };
    delete nextNotes[cellKey];
    setNotes(nextNotes);

    setHintsUsed((prev) => prev + 1);
    setActiveHint(null);

    // Check completion
    if (isBoardComplete(nextGrid, solution)) {
      const result = recordGameWin(difficulty, timer, dateStr);
      setIsVictory(true);
      setIsNewBest(result.isNewBest);
      setWinStreak(result.streak);
      setStats(loadStatistics());
    }
  };

  // Restart current puzzle to beginning
  const handleConfirmRestart = () => {
    setUserGrid(cloneGrid(initialGrid));
    setNotes({});
    setMistakes(0);
    setTimer(0);
    setHistory([]);
    setActiveHint(null);
    setShowRestartConfirm(false);
    if (preferences.hapticsEnabled) triggerHaptic('tap');
  };

  // Remaining counts for keypad
  const remainingCounts = getRemainingCounts(userGrid);

  return (
    <div className="min-h-screen bg-[#F8F8F6] dark:bg-[#121316] text-[#141517] dark:text-[#F1F2F6] flex flex-col justify-between paper-texture transition-colors">
      {/* Top HUD */}
      <HeaderHUD
        difficulty={difficulty}
        dateStr={dateStr}
        mistakes={mistakes}
        maxMistakes={preferences.relaxedMode ? null : 3}
        relaxedMode={preferences.relaxedMode}
        timer={timer}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenDaily={() => setShowDailyCalendar(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
        onNewGameClick={() => setShowDifficultyPicker(true)}
        onRestartClick={() => setShowRestartConfirm(true)}
        theme={preferences.theme}
        onToggleTheme={() =>
          setPreferences((prev) => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark',
          }))
        }
      />

      {/* Main Board View */}
      <main className="relative flex-1 flex flex-col items-center justify-center w-full px-2">
        <SudokuBoard
          currentGrid={userGrid}
          initialGrid={initialGrid}
          solution={solution}
          notes={notes}
          selectedCell={selectedCell}
          onSelectCell={(r, c) => setSelectedCell([r, c])}
          onNumberInput={handleNumberInput}
          onErase={handleErase}
          onTogglePencil={() => setIsPencilMode(!isPencilMode)}
          onTriggerHint={handleTriggerHint}
          inputMode={preferences.inputMode}
          activeDigit={activeDigit}
          hintTarget={activeHint ? [activeHint.row, activeHint.col] : null}
          highlightMatching={preferences.highlightMatching}
          highlightCrosshairs={preferences.highlightCrosshairs}
          hapticsEnabled={preferences.hapticsEnabled}
          isPaused={isPaused}
        />

        {/* Anti-Peek Pause Curtain */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <PauseOverlay onResume={() => setIsPaused(false)} timer={timer} />
          </div>
        )}
      </main>

      {/* Action Zone: Keypad (Input numbers ABOVE) -> Controls (Undo/Erase/Notes/Hint BELOW) -> Bottom Ad Banner */}
      <footer className="w-full max-w-md mx-auto flex flex-col justify-end">
        {/* Input numbers 1-9 section placed ABOVE */}
        <Keypad
          onNumberClick={handleNumberInput}
          remainingCounts={remainingCounts}
          inputMode={preferences.inputMode}
          activeDigit={activeDigit}
          onSelectDigit={(digit) => setActiveDigit(digit === 0 ? null : digit)}
          onToggleInputMode={(mode) =>
            setPreferences((prev) => ({ ...prev, inputMode: mode }))
          }
          hapticsEnabled={preferences.hapticsEnabled}
        />

        {/* Undo, Erase, Notes, Hint section placed BELOW numbers */}
        <GameControls
          canUndo={history.length > 0}
          onUndo={handleUndo}
          onErase={handleErase}
          isPencilMode={isPencilMode}
          onTogglePencil={() => setIsPencilMode(!isPencilMode)}
          onTriggerHint={handleTriggerHint}
          hintsUsed={hintsUsed}
          hapticsEnabled={preferences.hapticsEnabled}
        />

        {/* Bottom Ad Banner */}
        <BottomAdBanner />
      </footer>

      {/* Modals */}
      {showDifficultyPicker && (
        <DifficultyPickerModal
          currentDifficulty={difficulty}
          onSelectDifficulty={(diff) => {
            if (diff === 'daily') {
              setShowDailyCalendar(true);
            } else {
              startNewGame(diff);
            }
          }}
          onClose={() => setShowDifficultyPicker(false)}
          hasGameInProgress={timer > 0 && !isVictory}
        />
      )}

      {showDailyCalendar && (
        <DailyCalendarModal
          completedDates={stats.completedDailyDates}
          currentStreak={stats.currentStreak}
          maxStreak={stats.maxStreak}
          onSelectDate={(pickedDate) => startNewGame('daily', pickedDate)}
          onClose={() => setShowDailyCalendar(false)}
          selectedDateStr={dateStr}
        />
      )}

      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}

      {showSettings && (
        <SettingsModal
          preferences={preferences}
          onUpdatePreferences={(updated) =>
            setPreferences((prev) => ({ ...prev, ...updated }))
          }
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPlayStoreGuide && (
        <PlayStorePublishModal onClose={() => setShowPlayStoreGuide(false)} />
      )}

      {showRestartConfirm && (
        <RestartConfirmModal
          onConfirm={handleConfirmRestart}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}

      {activeHint && (
        <HintModal
          hint={activeHint}
          onApplyHint={handleApplyHint}
          onClose={() => setActiveHint(null)}
        />
      )}

      {isVictory && (
        <VictoryModal
          difficulty={difficulty}
          timeSeconds={timer}
          mistakes={mistakes}
          hintsUsed={hintsUsed}
          isNewBest={isNewBest}
          streak={winStreak}
          onPlayAgain={() => startNewGame(difficulty, dateStr)}
          onNextDifficulty={() => {
            const order: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const idx = order.indexOf(difficulty);
            const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : 'expert';
            startNewGame(next);
          }}
          onViewStats={() => setShowStats(true)}
        />
      )}

      {isGameOver && (
        <GameOverModal
          onContinueRelaxed={() => {
            setPreferences((prev) => ({ ...prev, relaxedMode: true }));
            setIsGameOver(false);
          }}
          onRestartCurrent={() => {
            setUserGrid(cloneGrid(initialGrid));
            setNotes({});
            setMistakes(0);
            setTimer(0);
            setIsGameOver(false);
            setHistory([]);
          }}
          onNewGame={() => startNewGame(difficulty)}
        />
      )}
    </div>
  );
}

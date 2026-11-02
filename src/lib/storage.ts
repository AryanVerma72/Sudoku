/**
 * LocalStorage persistence for game saves, statistics, and player preferences.
 */
import { Difficulty, Grid } from './sudoku';

export interface MoveHistoryItem {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
}

export interface SavedGameState {
  id: string;
  difficulty: Difficulty;
  dateStr?: string; // For daily challenge
  initialGrid: Grid;
  solution: Grid;
  userGrid: Grid;
  notes: Record<string, number[]>; // key "r,c" -> array of numbers
  mistakes: number;
  maxMistakes: number | null; // 3 or null
  timer: number;
  isCompleted: boolean;
  isPaused: boolean;
  history: MoveHistoryItem[];
  hintsUsed: number;
}

export interface SingleStat {
  gamesStarted: number;
  gamesWon: number;
  bestTime: number | null; // seconds
  totalTime: number; // seconds
}

export interface StatisticsData {
  easy: SingleStat;
  medium: SingleStat;
  hard: SingleStat;
  expert: SingleStat;
  daily: SingleStat;
  currentStreak: number;
  maxStreak: number;
  completedDailyDates: string[]; // ['2026-11-01', ...]
}

export interface PlayerPreferences {
  theme: 'light' | 'dark';
  inputMode: 'cell-first' | 'digit-first';
  relaxedMode: boolean;
  hapticsEnabled: boolean;
  autoClearNotes: boolean;
  highlightMatching: boolean;
  highlightCrosshairs: boolean;
}

const STORAGE_KEYS = {
  CURRENT_GAME: 'zensudoku_current_game',
  STATISTICS: 'zensudoku_stats',
  PREFERENCES: 'zensudoku_prefs',
};

const DEFAULT_SINGLE_STAT: SingleStat = {
  gamesStarted: 0,
  gamesWon: 0,
  bestTime: null,
  totalTime: 0,
};

export const DEFAULT_PREFERENCES: PlayerPreferences = {
  theme: 'light',
  inputMode: 'cell-first',
  relaxedMode: false,
  hapticsEnabled: true,
  autoClearNotes: true,
  highlightMatching: true,
  highlightCrosshairs: true,
};

export function loadPreferences(): PlayerPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: PlayerPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota
  }
}

export function loadSavedGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    if (raw) {
      const parsed = JSON.parse(raw) as SavedGameState;
      return parsed;
    }
  } catch {
    // Fallback
  }
  return null;
}

export function saveCurrentGame(game: SavedGameState | null): void {
  try {
    if (!game) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(game));
    }
  } catch {
    // Ignore storage quota
  }
}

export function loadStatistics(): StatisticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATISTICS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        easy: parsed.easy || { ...DEFAULT_SINGLE_STAT },
        medium: parsed.medium || { ...DEFAULT_SINGLE_STAT },
        hard: parsed.hard || { ...DEFAULT_SINGLE_STAT },
        expert: parsed.expert || { ...DEFAULT_SINGLE_STAT },
        daily: parsed.daily || { ...DEFAULT_SINGLE_STAT },
        currentStreak: parsed.currentStreak || 0,
        maxStreak: parsed.maxStreak || 0,
        completedDailyDates: parsed.completedDailyDates || [],
      };
    }
  } catch {
    // Fallback
  }
  return {
    easy: { ...DEFAULT_SINGLE_STAT },
    medium: { ...DEFAULT_SINGLE_STAT },
    hard: { ...DEFAULT_SINGLE_STAT },
    expert: { ...DEFAULT_SINGLE_STAT },
    daily: { ...DEFAULT_SINGLE_STAT },
    currentStreak: 0,
    maxStreak: 0,
    completedDailyDates: [],
  };
}

export function recordGameStart(difficulty: Difficulty): void {
  const stats = loadStatistics();
  const tier = stats[difficulty];
  if (tier) {
    tier.gamesStarted += 1;
    saveStatistics(stats);
  }
}

export function recordGameWin(
  difficulty: Difficulty,
  timeSeconds: number,
  dateStr?: string
): { isNewBest: boolean; streak: number } {
  const stats = loadStatistics();
  const tier = stats[difficulty];
  let isNewBest = false;

  if (tier) {
    tier.gamesWon += 1;
    tier.totalTime += timeSeconds;
    if (tier.bestTime === null || timeSeconds < tier.bestTime) {
      tier.bestTime = timeSeconds;
      isNewBest = true;
    }
  }

  // Daily streak calculation
  if (difficulty === 'daily' && dateStr) {
    if (!stats.completedDailyDates.includes(dateStr)) {
      stats.completedDailyDates.push(dateStr);
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.maxStreak) {
        stats.maxStreak = stats.currentStreak;
      }
    }
  }

  saveStatistics(stats);
  return { isNewBest, streak: stats.currentStreak };
}

export function saveStatistics(stats: StatisticsData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
  } catch {
    // Ignore storage quota
  }
}

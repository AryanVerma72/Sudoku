# ZenSudoku Android: Minimalist Paper & Ink Sudoku

A distraction-free, ad-free Sudoku game engineered for Android mobile touch displays with a tactile Paper and Ink aesthetic, robust puzzle generation across four difficulty tiers, daily calendar challenges, dual input ergonomics, and complete offline PWA installability.

> [!IMPORTANT]
> **Confirmed Player Decisions (from Phase 1)**:
> 1. **Mistake Tracking**: 3 mistakes limit with an optional relaxed mode toggle (configurable anytime in-game or via Quick Settings).
> 2. **Input Modes**: Dual input modes supported — **Cell-First** (tap cell, then tap number) and **Digit-First** (select digit, then tap cells in rapid succession) with instant toggle on the keypad.
> 3. **Visual Styling**: Minimalist Paper and Ink clean monochrome style featuring natural paper canvas (`#FBFBFA` / `#141517` night ink), sumi-ink typography, sharp hairline grid lines, and zero visual clutter.

---

### 1. Overview & Core Concept

- **What It Does**: ZenSudoku provides an authentic, newspaper-grade Sudoku experience optimized for Android touch screens. Players can generate unique puzzles across four classic tiers (Easy, Medium, Hard, Expert) or play the seeded Daily Challenge with streak tracking. Features include pencil candidate notes, smart hints with logical explanations, mistake detection, timer with anti-peek pause screen, auto-save state persistence, and lifetime performance statistics.
- **Target Audience**: Sudoku enthusiasts, daily commuters, and brain-training players seeking a clean, premium mobile puzzle game free of advertisements, paywalls, and telemetry.
- **Key Value**: Zero distraction, pure tactile logic, immediate loading, battery efficiency, and offline play on any Android device via Progressive Web App technology.

---

### 2. User Experience & Visual Design

#### A. Key User Flows
1. **App Launch & Home/Game Screen**:
   - Quick header: Brand wordmark ("ZenSudoku"), Daily Challenge shortcut badge, Theme switch (Light Paper / Dark Sumi Ink), Settings modal trigger.
   - Status Bar (HUD): Difficulty tag, Mistake counter (`Mistakes: 1/3` or `Mistakes: 1` in Relaxed Mode), Timer with Pause icon (`04:12` [Pause]).
   - Sudoku Board (9×9): Crisp 3×3 bold blocks, highlighted active row/col/box, identical digit highlight, pencil notes grid (3×3 per cell).
   - Control Toolbar: **Undo**, **Erase**, **Pencil (Notes)** toggle with count indicator, and **Hint** button with available count.
   - Number Keypad (1–9): Large tactile touch targets ($\ge 44\text{px}$), remaining count badges showing how many of each digit are left (1 to 9), and an **Input Mode Switcher** (`[Cell-First] | [Digit-First]`).
2. **Daily Challenge Flow**:
   - Tap "Daily Challenge" to open the interactive monthly calendar sheet.
   - Completed days display a clean stamp. Players can play today's puzzle or catch up on past days of the month.
3. **Pause & Resume Flow**:
   - Tapping pause dims the board with an elegant frosted paper overlay ("Game Paused · 05:23") with a large "Resume" button so players cannot study the board while the clock is stopped.
   - Game state is continuously synchronized to `localStorage` on every keystroke, allowing instant resume upon browser restart.
4. **Victory & Game Over Dialogs**:
   - **Victory**: Elegant completion screen with time, difficulty, mistakes made, hints used, new best time recognition, and "New Game" / "View Stats" actions.
   - **Game Over (3 Mistakes)**: Clean retry modal with option to continue in Relaxed Mode or start a fresh board.
5. **Statistics Modal**:
   - Tabbed view across Easy, Medium, Hard, Expert, and Daily.
   - Metrics: Games Started, Games Won, Win Rate %, Best Time (mm:ss), Average Time (mm:ss), and Current / Best Daily Streak.

#### B. Visual Identity & Theme (Paper & Ink)
- **Palette**:
  - *Light (Washi / Newsprint)*:
    - Canvas background: `#F8F8F6` (warm tactile newsprint)
    - Board surface: `#FFFFFF` with `#D4D4D0` subtle borders and `#2B2D31` 3x3 block dividers
    - Clue numbers: Deep archival ink `#111215` (bold font-serif or geometric sans)
    - User input numbers: Indigo ink `#1E3A8A` or crisp charcoal `#2D3748`
    - Error numbers: Crimson ink `#DC2626`
    - Selected cell highlight: `#E8ECF4` / `#DFE6F2`
    - Same-digit match highlight: `#F0F4FA`
    - Pencil notes: Muted pencil graphite `#6B7280`
  - *Dark (Sumi Ink / Slate)*:
    - Canvas background: `#121316`
    - Board surface: `#1A1B1F` with `#2E3038` subtle cell lines and `#4B5162` 3x3 dividers
    - Clue numbers: Rice paper white `#F1F2F6`
    - User input numbers: Pale sky `#93C5FD`
    - Error numbers: Coral red `#EF4444`
    - Selected cell highlight: `#252A36`
    - Same-digit match highlight: `#1E2430`
    - Pencil notes: Dim slate `#9CA3AF`
- **Typography**:
  - Primary Display & Headings: `Plus Jakarta Sans` or clean modern geometric sans.
  - Sudoku Digits: High-clarity tabular figures (`tabular-nums font-semibold text-xl sm:text-2xl`) with maximum readability at arm's length.
  - Pencil Notes: Mini 3x3 micro-grid (`text-[9px] sm:text-[10px] leading-tight font-medium`).
- **Android Touch Ergonomics**:
  - Grid cells calibrated for responsive square aspect ratio, taking up to 94vw on mobile (max 460px container).
  - Keypad buttons $\ge 48\text{px}$ touch targets within thumb reach zone.
  - Light haptic feedback via `navigator.vibrate(10)` on cell selection, digit placement, and error alerts.

---

### 3. Key Product Decisions & Trade-Offs

- **Deterministic Puzzle Generation & Fast Solver**:
  - *Decision*: Client-side algorithmic backtracking generator with symmetry masking and unique solution verification.
  - *Rationale*: Guarantees instant puzzle creation with 0 latency, 100% offline functionality, and infinite replayability without server dependency.
- **Daily Challenge Seed**:
  - *Decision*: Pseudo-random Linear Congruential Generator (LCG) seeded by `YYYY-MM-DD`.
  - *Rationale*: Every Android player worldwide gets the exact same Daily Challenge puzzle on a given day without needing a backend database.
- **Dual Input Architecture**:
  - *Decision*: Seamless toggle between Cell-First and Digit-First.
  - *Rationale*: Speed-solvers love Digit-First (tap "5" then tap all three cells where 5 goes), while classic solvers prefer Cell-First.
- **Smart Hint System**:
  - *Decision*: Multi-step hint. First tap gives the logical deduction clue (e.g. "Only candidate 7 can fit in this cell based on Row 3 and Box 1"), second tap solves the cell.
  - *Rationale*: Educational and satisfying rather than spoiling the answer immediately.
- **PWA & Offline First**:
  - *Decision*: Installable Web App Manifest with standalone display mode, Android theme-color meta tags, safe-area insets, and offline cache.
  - *Rationale*: Matches the user's explicit request for an "Android application game" while remaining web-native, light, and zero-ad.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                         ZenSudoku Android App                          │
├──────────────────────────────────┬─────────────────────────────────────┤
│  Top Bar & HUD                   │  App Controls & Modal Triggers       │
│  - Brand Wordmark                │  - New Game / Difficulty Picker     │
│  - Mistakes (e.g. 1/3)           │  - Daily Challenge Calendar         │
│  - Timer & Anti-Peek Pause       │  - Statistics & Lifetime Bests      │
│  - Relaxed Mode & Theme Toggle   │  - PWA Install Button (Android)     │
├──────────────────────────────────┴─────────────────────────────────────┤
│                       Interactive 9×9 Sudoku Grid                       │
│  - 3×3 Major Box Sections (Solid Dividers)                             │
│  - Cells with Given Clues vs User Entries vs Conflicts                 │
│  - 3×3 Mini Pencil Note Candidate Subgrid (1–9)                        │
│  - Crosshair Highlight (Active Row, Column, Box)                       │
│  - Matching Number Instances Highlight                                 │
├────────────────────────────────────────────────────────────────────────┤
│                      Input & Gameplay Action Zone                       │
│  - Action Bar: Undo, Erase, Pencil Mode Toggle, Smart Hint             │
│  - Input Mode Segmented Control: [Cell-First] | [Digit-First]          │
│  - 1–9 Number Keypad with Remaining Digit Counter Badges               │
├────────────────────────────────────────────────────────────────────────┤
│                       Client Engine & Storage                          │
│  - Sudoku Generator (Easy/Med/Hard/Expert & Daily Seed)                │
│  - Solver & Uniqueness Checker                                         │
│  - LocalStorage State Manager: In-Progress Game & Stats Cache           │
│  - Web Audio & Vibration Haptics Controller                            │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Key State Entities & LocalStorage Schema
1. `currentGameState`:
   - `id`: string
   - `difficulty`: `'easy' | 'medium' | 'hard' | 'expert' | 'daily'`
   - `date`: string (for daily challenge)
   - `initialGrid`: number[9][9] (clues)
   - `solution`: number[9][9]
   - `userGrid`: number[9][9]
   - `notes`: Record<string, number[]> (cellKey -> candidates)
   - `mistakes`: number
   - `maxMistakes`: number (3 or null for relaxed)
   - `timer`: number (elapsed seconds)
   - `isPaused`: boolean
   - `isCompleted`: boolean
   - `history`: Array<{ row, col, prevVal, newVal, prevNotes, newNotes }>
2. `userStatistics`:
   - Grouped by difficulty tier: `{ gamesStarted, gamesWon, bestTime, totalTime, winStreak, maxStreak }`
   - `dailyCompletedDates`: string[] (array of 'YYYY-MM-DD')
3. `userPreferences`:
   - `theme`: `'light' | 'dark'`
   - `inputMode`: `'cell-first' | 'digit-first'`
   - `relaxedMode`: boolean
   - `hapticsEnabled`: boolean
   - `highlightMatching`: boolean
   - `autoClearNotes`: boolean

#### B. Component Decomposition
- `App.tsx`: Root shell, theme provider, global state sync, PWA install prompt.
- `components/SudokuBoard.tsx`: 9x9 board with touch interaction, keyboard navigation, cell styling.
- `components/SudokuCell.tsx`: Individual cell renderer with digit, pencil notes, selection crosshairs, error badges.
- `components/Keypad.tsx`: 1-9 buttons, remaining counts, mode switcher.
- `components/GameControls.tsx`: Undo, Erase, Pencil toggle, Hint.
- `components/HeaderHUD.tsx`: Timer, mistakes, difficulty label, pause button.
- `components/DailyCalendarModal.tsx`: Monthly calendar grid to pick any daily puzzle and review completion badges.
- `components/StatsModal.tsx`: Comprehensive stats dashboard with best times and win percentages.
- `components/SettingsModal.tsx`: Relaxed mode toggle, haptics, theme, auto-clear pencil notes setting.
- `components/PauseOverlay.tsx`: Anti-cheating blur curtain with resume trigger.
- `components/VictoryModal.tsx`: Win fanfare, stats breakdown, next puzzle prompt.
- `lib/sudoku.ts`: Board generator, solver, validator, daily seed generator, candidate helper.
- `lib/haptics.ts`: Touch vibration helper with graceful fallback.

---

### 5. Verification Plan

- **Compilation**: Verify build with `compile_applet` and check lint status with `lint_applet`.
- **Gameplay Functional Testing**:
  - Test puzzle generation across all 4 difficulties and verify that given cells cannot be edited.
  - Test Cell-First and Digit-First input modes.
  - Test Pencil mode: toggling notes on and off, and auto-removal of pencil notes when a number is placed in the same line/box.
  - Test Mistake counter: increments on wrong digit, game over at 3 mistakes when relaxed mode is off, continues when relaxed mode is on.
  - Test Smart Hint: identifies empty cells and provides explanation + fills cell.
  - Test Timer: counts up during play, freezes during pause, resumes on button tap.
  - Test Auto-Save: refresh page or close modal and confirm game state is restored.
  - Test Daily Challenge: deterministic puzzle for today, streak increments upon completion.
  - Test Statistics: verifies win recorded and best times updated in localStorage.
  - Test Theme toggle: Paper (light) and Sumi Ink (dark) contrast integrity.

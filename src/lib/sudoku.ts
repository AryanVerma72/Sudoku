/**
 * Sudoku Engine: Generation, Validation, Solving, and Smart Hints.
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'daily';

export type Grid = number[][];

export interface HintResult {
  row: number;
  col: number;
  value: number;
  explanation: string;
  technique: 'Naked Single' | 'Hidden Single' | 'Logical Deduction' | 'Conflict Correction';
  isCorrection?: boolean;
}

// Simple Mulberry32 seeded PRNG
export function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashDateStringToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function createEmptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

/** Check if placing num at grid[row][col] is legal */
export function isValid(grid: Grid, row: number, col: number, num: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cr = startRow + r;
      const cc = startCol + c;
      if ((cr !== row || cc !== col) && grid[cr][cc] === num) return false;
    }
  }
  return true;
}

/** Get valid candidate numbers for a cell */
export function getCandidates(grid: Grid, row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

/** Solve Sudoku in-place using backtracking */
export function solve(grid: Grid, randFn: () => number = Math.random): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        // Randomize numbers order for varied board generation
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => randFn() - 0.5);
        for (const num of numbers) {
          if (isValid(grid, r, c, num)) {
            grid[r][c] = num;
            if (solve(grid, randFn)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/** Count solutions up to limit to verify uniqueness */
export function countSolutions(grid: Grid, limit = 2): number {
  let count = 0;

  function backtrack(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, r, c, num)) {
              grid[r][c] = num;
              if (backtrack()) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  backtrack();
  return count;
}

/**
 * Generate a complete, unique Sudoku puzzle
 */
export function generateSudoku(
  difficulty: Difficulty,
  dateSeed?: string
): { initialGrid: Grid; solution: Grid } {
  const randFn = dateSeed
    ? createSeededRandom(hashDateStringToSeed(dateSeed))
    : Math.random;

  // 1. Generate a solved board
  const board = createEmptyGrid();
  // Fill diagonal 3x3 boxes first to speed up backtracking
  for (let i = 0; i < 9; i += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => randFn() - 0.5);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[i + r][i + c] = nums[idx++];
      }
    }
  }
  solve(board, randFn);
  const solution = cloneGrid(board);

  // 2. Remove clues based on difficulty
  // Clue targets:
  // Easy: ~36-38 clues (remove ~43-45)
  // Medium: ~30-33 clues (remove ~48-51)
  // Hard: ~26-28 clues (remove ~53-55)
  // Expert: ~22-24 clues (remove ~57-59)
  // Daily: rotates based on day of week (Mon = easy ... Sun = expert)
  let cluesToRemove: number;

  if (difficulty === 'daily' && dateSeed) {
    const dayOfWeek = new Date(dateSeed + 'T00:00:00').getDay(); // 0 is Sunday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      cluesToRemove = 54; // Weekend hard
    } else if (dayOfWeek === 3 || dayOfWeek === 4) {
      cluesToRemove = 49; // Midweek medium
    } else {
      cluesToRemove = 44; // Early week easy
    }
  } else {
    switch (difficulty) {
      case 'easy':
        cluesToRemove = 42;
        break;
      case 'medium':
        cluesToRemove = 49;
        break;
      case 'hard':
        cluesToRemove = 54;
        break;
      case 'expert':
        cluesToRemove = 58;
        break;
      default:
        cluesToRemove = 46;
    }
  }

  const puzzle = cloneGrid(solution);

  // Generate symmetrical cell coordinate pairs (180° rotational symmetry)
  const cellPairs: [number, number, number, number][] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      const oppR = 8 - r;
      const oppC = 8 - c;
      if (r === 4 && c >= 5) continue;
      cellPairs.push([r, c, oppR, oppC]);
    }
  }

  // Shuffle pairs
  cellPairs.sort(() => randFn() - 0.5);

  let removed = 0;
  for (const [r1, c1, r2, c2] of cellPairs) {
    if (removed >= cluesToRemove) break;

    const val1 = puzzle[r1][c1];
    const val2 = puzzle[r2][c2];

    if (val1 === 0) continue;

    puzzle[r1][c1] = 0;
    puzzle[r2][c2] = 0;

    // Check if puzzle still has a unique solution
    const testCopy = cloneGrid(puzzle);
    if (countSolutions(testCopy) !== 1) {
      // Revert if not unique
      puzzle[r1][c1] = val1;
      puzzle[r2][c2] = val2;
    } else {
      removed += r1 === r2 && c1 === c2 ? 1 : 2;
    }
  }

  return { initialGrid: puzzle, solution };
}

/**
 * Smart Hint deduction engine
 */
export function getSmartHint(
  currentGrid: Grid,
  initialGrid: Grid,
  solution: Grid
): HintResult | null {
  // 1. Check if there is an incorrect user-entered digit first
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] !== 0 && initialGrid[r][c] === 0) {
        if (currentGrid[r][c] !== solution[r][c]) {
          return {
            row: r,
            col: c,
            value: solution[r][c],
            explanation: `The number ${currentGrid[r][c]} in Row ${r + 1}, Column ${c + 1} is incorrect. Replace it or clear it.`,
            technique: 'Conflict Correction',
            isCorrection: true,
          };
        }
      }
    }
  }

  // 2. Check for Naked Singles (cell with exactly 1 valid candidate in current state)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0) {
        const candidates = getCandidates(currentGrid, r, c);
        if (candidates.length === 1) {
          const val = candidates[0];
          return {
            row: r,
            col: c,
            value: val,
            explanation: `Only candidate ${val} can legally fit in Row ${r + 1}, Column ${c + 1} without conflicting with its row, column, or 3×3 box.`,
            technique: 'Naked Single',
          };
        }
      }
    }
  }

  // 3. Check for Hidden Singles in Rows
  for (let r = 0; r < 9; r++) {
    for (let num = 1; num <= 9; num++) {
      let possibleCols: number[] = [];
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] === 0 && isValid(currentGrid, r, c, num)) {
          possibleCols.push(c);
        }
      }
      if (possibleCols.length === 1) {
        const c = possibleCols[0];
        return {
          row: r,
          col: c,
          value: num,
          explanation: `In Row ${r + 1}, Column ${c + 1} is the only remaining cell that can accept the number ${num}.`,
          technique: 'Hidden Single',
        };
      }
    }
  }

  // 4. Check for Hidden Singles in Columns
  for (let c = 0; c < 9; c++) {
    for (let num = 1; num <= 9; num++) {
      let possibleRows: number[] = [];
      for (let r = 0; r < 9; r++) {
        if (currentGrid[r][c] === 0 && isValid(currentGrid, r, c, num)) {
          possibleRows.push(r);
        }
      }
      if (possibleRows.length === 1) {
        const r = possibleRows[0];
        return {
          row: r,
          col: c,
          value: num,
          explanation: `In Column ${c + 1}, Row ${r + 1} is the only remaining cell where ${num} can legally be placed.`,
          technique: 'Hidden Single',
        };
      }
    }
  }

  // 5. Check for Hidden Singles in 3x3 Boxes
  for (let bRow = 0; bRow < 3; bRow++) {
    for (let bCol = 0; bCol < 3; bCol++) {
      const startR = bRow * 3;
      const startC = bCol * 3;
      for (let num = 1; num <= 9; num++) {
        let cells: [number, number][] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const row = startR + r;
            const col = startC + c;
            if (currentGrid[row][col] === 0 && isValid(currentGrid, row, col, num)) {
              cells.push([row, col]);
            }
          }
        }
        if (cells.length === 1) {
          const [r, c] = cells[0];
          return {
            row: r,
            col: c,
            value: num,
            explanation: `In this 3×3 box, Row ${r + 1}, Column ${c + 1} is the only cell available for ${num}.`,
            technique: 'Hidden Single',
          };
        }
      }
    }
  }

  // 6. Fallback: Find the empty cell with the fewest candidates based on the precomputed solution
  let bestCell: { row: number; col: number; count: number } | null = null;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0) {
        const count = getCandidates(currentGrid, r, c).length;
        if (!bestCell || count < bestCell.count) {
          bestCell = { row: r, col: c, count };
        }
      }
    }
  }

  if (bestCell) {
    const { row, col } = bestCell;
    const val = solution[row][col];
    return {
      row,
      col,
      value: val,
      explanation: `Logical deduction reveals that ${val} belongs in Row ${row + 1}, Column ${col + 1}.`,
      technique: 'Logical Deduction',
    };
  }

  return null;
}

/** Check if the board is completely and correctly solved */
export function isBoardComplete(currentGrid: Grid, solution: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0 || currentGrid[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/** Count remaining numbers for keypad badges (1-9) */
export function getRemainingCounts(currentGrid: Grid): Record<number, number> {
  const counts: Record<number, number> = {
    1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9
  };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = currentGrid[r][c];
      if (val >= 1 && val <= 9) {
        counts[val] = Math.max(0, counts[val] - 1);
      }
    }
  }
  return counts;
}

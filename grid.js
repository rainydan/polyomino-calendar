/**
 * Calendar grid layout and utilities
 * 
 * Grid structure (6 rows × 8 columns):
 * 
 *   0 1 2 3 4 5 6 7
 * 0   M M M M M M       (Months 1-6, centered)
 * 1   M M M M M M       (Months 7-12, centered)
 * 2 D D D D D D D D     (Days 1-8)
 * 3 D D D D D D D D     (Days 9-16)
 * 4 D D D D D D D D     (Days 17-24)
 * 5 D D D D D D         (Days 25-31)
 * 
 * Total filled squares: 12 months + 31 days = 43
 * Grid size: 48 total squares (6 × 8)
 * Unused squares: 5 (positions [0,0], [0,7], [6,0], [6,7], [6,1] conceptually, but we only have 6 rows)
 */

export const GRID_ROWS = 6;
export const GRID_COLS = 8;

/**
 * Calendar square types
 */
export const SQUARE_TYPE = {
  EMPTY: 'empty',
  MONTH: 'month',
  DAY: 'day'
};

/**
 * Month names (January = 0, December = 11)
 */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Initialize the grid with calendar squares
 * @returns {Array<Array<Object>>} 2D grid where each cell is { type, label, monthIndex?, dayNumber? }
 */
export function initializeGrid() {
  const grid = Array(GRID_ROWS).fill(null).map(() =>
    Array(GRID_COLS).fill(null).map(() => ({ type: SQUARE_TYPE.EMPTY }))
  );

  // Place months (2 rows of 6, centered in columns 1-6)
  const months = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],  // Months 0-5 (Jan-Jun)
    [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6]   // Months 6-11 (Jul-Dec)
  ];
  
  months.forEach((pos, monthIndex) => {
    const [row, col] = pos;
    grid[row][col] = {
      type: SQUARE_TYPE.MONTH,
      label: MONTH_NAMES[monthIndex],
      monthIndex
    };
  });

  // Place days (3 rows of 8 + 1 row of 7)
  let dayNumber = 1;
  
  // Days 1-8 (row 2)
  for (let col = 0; col < 8; col++) {
    grid[2][col] = {
      type: SQUARE_TYPE.DAY,
      label: dayNumber.toString(),
      dayNumber
    };
    dayNumber++;
  }
  
  // Days 9-16 (row 3)
  for (let col = 0; col < 8; col++) {
    grid[3][col] = {
      type: SQUARE_TYPE.DAY,
      label: dayNumber.toString(),
      dayNumber
    };
    dayNumber++;
  }
  
  // Days 17-24 (row 4)
  for (let col = 0; col < 8; col++) {
    grid[4][col] = {
      type: SQUARE_TYPE.DAY,
      label: dayNumber.toString(),
      dayNumber
    };
    dayNumber++;
  }
  
  // Days 25-31 (row 5, columns 0-6)
  for (let col = 0; col < 7; col++) {
    grid[5][col] = {
      type: SQUARE_TYPE.DAY,
      label: dayNumber.toString(),
      dayNumber
    };
    dayNumber++;
  }

  return grid;
}

/**
 * Get all calendar square positions as an array
 * @returns {Array<[row, col, square]>} Array of [row, col, square] tuples
 */
export function getAllSquares() {
  const grid = initializeGrid();
  const squares = [];
  
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const square = grid[row][col];
      if (square.type !== SQUARE_TYPE.EMPTY) {
        squares.push([row, col, square]);
      }
    }
  }
  
  return squares;
}

/**
 * Get grid square at a specific position
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Object|null} Square object or null if out of bounds or empty
 */
export function getSquare(row, col) {
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
    return null;
  }
  const grid = initializeGrid();
  const square = grid[row][col];
  return square.type === SQUARE_TYPE.EMPTY ? null : square;
}

/**
 * Check if a position is valid (within grid bounds and is a calendar square)
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean}
 */
export function isValidGridPosition(row, col) {
  return row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS && getSquare(row, col) !== null;
}

/**
 * Check if all filled squares are valid calendar positions
 * @param {Array} coords - Array of [row, col] coordinates (absolute grid positions)
 * @returns {boolean}
 */
export function areAllCoordinatesValid(coords) {
  return coords.every(([row, col]) => isValidGridPosition(row, col));
}

/**
 * Convert piece coordinates (relative) to grid coordinates (absolute)
 * Piece coordinates are relative to piece origin, grid coordinates are absolute
 * @param {Array} pieceCoords - Array of [x, y] relative to piece origin
 * @param {number} gridRow - Absolute grid row where piece origin is placed
 * @param {number} gridCol - Absolute grid column where piece origin is placed
 * @returns {Array} Array of [row, col] absolute grid coordinates
 */
export function pieceToGridCoords(pieceCoords, gridRow, gridCol) {
  return pieceCoords.map(([x, y]) => [gridRow + y, gridCol + x]);
}

/**
 * Check if a piece placement would collide with existing pieces or go out of bounds
 * @param {Array} pieceCoords - Array of [row, col] grid coordinates
 * @param {Set} occupiedSquares - Set of occupied positions (as "row,col" strings)
 * @returns {boolean} true if placement is valid
 */
export function isValidPlacement(pieceCoords, occupiedSquares) {
  return pieceCoords.every(([row, col]) => {
    // Must be on a valid calendar square
    if (!isValidGridPosition(row, col)) {
      return false;
    }
    // Must not overlap with occupied squares
    if (occupiedSquares.has(`${row},${col}`)) {
      return false;
    }
    return true;
  });
}

/**
 * Get visual grid layout for rendering
 * Useful for determining pixel positions and dimensions
 * @returns {Array<Array>} 2D array with square info for rendering
 */
export function getRenderGrid() {
  const grid = initializeGrid();
  return grid.map(row =>
    row.map(square => ({
      ...square,
      isCalendarSquare: square.type !== SQUARE_TYPE.EMPTY
    }))
  );
}

/**
 * Get the current date as month and day
 * @returns {Object} { monthIndex, dayNumber }
 */
export function getCurrentDate() {
  const now = new Date();
  return {
    monthIndex: now.getMonth(),       // 0-11
    dayNumber: now.getDate()          // 1-31
  };
}

/**
 * Find grid position of a specific month
 * @param {number} monthIndex - Month index (0-11)
 * @returns {[row, col]|null} Grid position or null if not found
 */
export function findMonthPosition(monthIndex) {
  const squares = getAllSquares();
  const square = squares.find(([, , s]) => s.type === SQUARE_TYPE.MONTH && s.monthIndex === monthIndex);
  return square ? [square[0], square[1]] : null;
}

/**
 * Find grid position of a specific day
 * @param {number} dayNumber - Day number (1-31)
 * @returns {[row, col]|null} Grid position or null if not found
 */
export function findDayPosition(dayNumber) {
  const squares = getAllSquares();
  const square = squares.find(([, , s]) => s.type === SQUARE_TYPE.DAY && s.dayNumber === dayNumber);
  return square ? [square[0], square[1]] : null;
}

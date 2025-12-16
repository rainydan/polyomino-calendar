/**
 * Polyomino piece definitions for the calendar puzzle
 * 
 * Each piece is defined with:
 * - name: Display name
 * - color: CSS color for rendering
 * - orientations: Array of all unique orientations (rotations + flips)
 *   Each orientation contains coordinate pairs [x, y] relative to origin (0,0)
 */

/**
 * Helper function to rotate coordinates 90 degrees clockwise
 * @param {Array} coords - Array of [x, y] pairs
 * @returns {Array} Rotated coordinates
 */
function rotateCoords(coords) {
  // Rotation: (x,y) -> (y, -x), then normalize
  const rotated = coords.map(([x, y]) => [y, -x]);
  // Normalize to positive coordinates
  const minX = Math.min(...rotated.map(([x]) => x));
  const minY = Math.min(...rotated.map(([, y]) => y));
  return rotated.map(([x, y]) => [x - minX, y - minY]);
}

/**
 * Helper function to flip coordinates horizontally (around vertical axis)
 * Reflects each square based on its distance from the center
 * @param {Array} coords - Array of [x, y] pairs
 * @returns {Array} Flipped coordinates
 */
function flipCoords(coords) {
   // Find the center of the piece
   const minX = Math.min(...coords.map(([x]) => x));
   const maxX = Math.max(...coords.map(([x]) => x));
   const center = (minX + maxX) / 2;
   
   // Flip: each x becomes 2*center - x, then normalize
   const flipped = coords.map(([x, y]) => [2 * center - x, y]);
   
   // Normalize to positive coordinates
   const minFlippedX = Math.min(...flipped.map(([x]) => x));
   return flipped.map(([x, y]) => [x - minFlippedX, y]);
}

/**
 * Generate all unique orientations (rotations and flips) for a piece
 * @param {Array} baseCoords - Starting coordinates
 * @returns {Array} Array of unique orientation coordinate arrays
 */
function generateOrientations(baseCoords) {
  const orientations = [];
  const seen = new Set();
  
  let current = baseCoords;
  
  // Try 4 rotations
  for (let r = 0; r < 4; r++) {
    const key = JSON.stringify(current.sort((a, b) => a[0] - b[0] || a[1] - b[1]));
    if (!seen.has(key)) {
      seen.add(key);
      orientations.push([...current].sort((a, b) => a[0] - b[0] || a[1] - b[1]));
    }
    current = rotateCoords(current);
  }
  
  // Try 4 rotations of the flipped version
  current = flipCoords(baseCoords);
  for (let r = 0; r < 4; r++) {
    const key = JSON.stringify(current.sort((a, b) => a[0] - b[0] || a[1] - b[1]));
    if (!seen.has(key)) {
      seen.add(key);
      orientations.push([...current].sort((a, b) => a[0] - b[0] || a[1] - b[1]));
    }
    current = rotateCoords(current);
  }
  
  return orientations;
}

export const pieces = {
  // Pentominoes - using color-blind friendly palette with high contrast
  L: {
    name: "L",
    color: "#E74C3C",  // Bright red
    orientations: generateOrientations([[0,0], [1,0], [2,0], [3,0], [0,1]])
  },
  N: {
    name: "N",
    color: "#3498DB",  // Bright blue
    orientations: generateOrientations([[0,0], [1,0], [1,1], [2,1], [3,1]])
  },
  P: {
    name: "P",
    color: "#27AE60",  // Green
    orientations: generateOrientations([[0,0], [1,0], [0,1], [1,1], [0,2]])
  },
  U: {
    name: "U",
    color: "#F39C12",  // Orange/amber
    orientations: generateOrientations([[0,0], [2,0], [0,1], [1,1], [2,1]])
  },
  V: {
    name: "V",
    color: "#8E44AD",  // Purple
    orientations: generateOrientations([[0,0], [1,0], [2,0], [0,1], [0,2]])
  },
  Y: {
    name: "Y",
    color: "#E91E63",  // Pink/magenta
    orientations: generateOrientations([[0,0], [1,0], [2,0], [3,0], [1,1]])
  },
  Z: {
    name: "Z",
    color: "#16A085",  // Teal/cyan
    orientations: generateOrientations([[0,0], [0,1], [1,1], [2,1], [2,2]])
  },

  // Hexomino
  RECTANGLE: {
    name: "Rectangle",
    color: "#E67E22",  // Burnt orange
    orientations: generateOrientations([[0,0], [1,0], [2,0], [0,1], [1,1], [2,1]])
  }
};

/**
 * Returns a piece by name
 * @param {string} name - Piece name (L, N, P, U, V, Y, Z, RECTANGLE)
 * @returns {Object} Piece definition
 */
export function getPiece(name) {
  return pieces[name];
}

/**
 * Returns all piece names in order
 * @returns {string[]} Array of piece names
 */
export function getPieceNames() {
  return Object.keys(pieces);
}

/**
 * Get a specific orientation of a piece
 * @param {string} name - Piece name
 * @param {number} orientationIndex - Orientation index
 * @returns {Array} Array of [x, y] coordinates
 */
export function getPieceOrientation(name, orientationIndex = 0) {
  const piece = pieces[name];
  if (!piece) return null;
  const normalizedIndex = ((orientationIndex % piece.orientations.length) + piece.orientations.length) % piece.orientations.length;
  return piece.orientations[normalizedIndex];
}

/**
 * Get the next orientation for a piece (clockwise rotation)
 * @param {string} name - Piece name
 * @param {number} currentIndex - Current orientation index
 * @returns {number} Next orientation index
 */
export function nextOrientation(name, currentIndex = 0) {
  const piece = pieces[name];
  if (!piece) return 0;
  return (currentIndex + 1) % piece.orientations.length;
}

/**
 * Get the previous orientation for a piece (counter-clockwise rotation)
 * @param {string} name - Piece name
 * @param {number} currentIndex - Current orientation index
 * @returns {number} Previous orientation index
 */
export function prevOrientation(name, currentIndex = 0) {
  const piece = pieces[name];
  if (!piece) return 0;
  return (currentIndex - 1 + piece.orientations.length) % piece.orientations.length;
}

/**
 * Find the orientation index that represents the horizontal flip of the current orientation.
 * @param {string} name - Piece name
 * @param {number} currentIndex - Current orientation index
 * @returns {number} Index of the flipped orientation, or currentIndex if not found
 */
export function findFlippedOrientation(name, currentIndex = 0) {
  const piece = pieces[name];
  if (!piece) return currentIndex;

  const currentCoords = piece.orientations[currentIndex];
  const flipped = flipCoords(currentCoords);
  const normalizedFlipped = flipped.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  // Find matching orientation
  for (let i = 0; i < piece.orientations.length; i++) {
    const oriented = piece.orientations[i].slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (JSON.stringify(oriented) === JSON.stringify(normalizedFlipped)) {
      return i;
    }
  }

  return currentIndex; // Fallback if no match found
}

/**
 * Get the bounding box of a set of coordinates
 * @param {Array} coords - Array of [x, y] coordinates
 * @returns {Object} { minX, maxX, minY, maxY, width, height }
 */
export function getBoundingBox(coords) {
  if (!coords || coords.length === 0) return null;
  
  const xs = coords.map(([x]) => x);
  const ys = coords.map(([, y]) => y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

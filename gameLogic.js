// gameLogic.js - Pure game logic functions (no DOM, no side effects)
// These functions operate on the game model and are fully testable without UI.

import { pieceToGridCoords, getAllSquares } from './grid.js';
import { getPiece } from './pieces.js';

/**
 * Create a fresh game model object.
 * @param {Array} grid - The grid from initializeGrid()
 * @returns {Object} Fresh game model with empty state
 */
export function createGameModel(grid) {
    return {
        grid,
        placedPieces: new Map(), // Map<pieceName, { row, col, orientationIndex }>
        occupiedSquares: new Set() // Set<"row,col">
    };
}

/**
 * Rebuild the occupiedSquares Set from all currently placed pieces.
 * Call this after removing a piece to recalculate coverage.
 * @param {Object} gameModel - The game model
 */
export function rebuildOccupiedSquares(gameModel) {
    gameModel.occupiedSquares.clear();
    gameModel.placedPieces.forEach((placement, pieceName) => {
        const piece = getPiece(pieceName);
        const coords = piece.orientations[placement.orientationIndex];
        const gridCoords = pieceToGridCoords(coords, placement.row, placement.col);
        gridCoords.forEach(([r, c]) => {
            gameModel.occupiedSquares.add(`${r},${c}`);
        });
    });
}

/**
 * Place a piece on the game board (atomic operation).
 * @param {Object} gameModel - The game model
 * @param {string} pieceName - Name of the piece
 * @param {number} row - Grid row for placement origin
 * @param {number} col - Grid column for placement origin
 * @param {number} orientationIndex - Index into piece.orientations
 * @returns {boolean} True if placement was recorded
 */
export function placePiece(gameModel, pieceName, row, col, orientationIndex) {
    // Record the placement
    gameModel.placedPieces.set(pieceName, { row, col, orientationIndex });

    // Add to occupied squares
    const piece = getPiece(pieceName);
    const coords = piece.orientations[orientationIndex];
    const gridCoords = pieceToGridCoords(coords, row, col);
    gridCoords.forEach(([r, c]) => {
        gameModel.occupiedSquares.add(`${r},${c}`);
    });

    return true;
}

/**
 * Remove a piece from the game board (atomic operation).
 * @param {Object} gameModel - The game model
 * @param {string} pieceName - Name of the piece to remove
 * @returns {boolean} True if piece was removed, false if not found
 */
export function removePiece(gameModel, pieceName) {
    if (!gameModel.placedPieces.has(pieceName)) {
        return false;
    }

    gameModel.placedPieces.delete(pieceName);
    rebuildOccupiedSquares(gameModel);
    return true;
}

/**
 * Check if the puzzle is solved (all non-date squares covered).
 * @param {Object} gameModel - The game model
 * @param {Object} currentDate - { monthIndex, dayNumber }
 * @returns {boolean} True if all required squares are covered
 */
export function checkWinCondition(gameModel, currentDate) {
    // Get all non-empty squares from grid utilities
    const allSquares = getAllSquares();

    // Filter to only squares that should be covered (exclude current date)
    const squaresToCover = allSquares
        .filter(([row, col, square]) => {
            const isCurrent = (square.type === 'month' && square.monthIndex === currentDate.monthIndex) ||
                             (square.type === 'day' && square.dayNumber === currentDate.dayNumber);
            return !isCurrent;
        })
        .map(([row, col]) => `${row},${col}`);

    // Check if all required squares are occupied
    return squaresToCover.every(sq => gameModel.occupiedSquares.has(sq));
}

/**
 * Reset the game model to initial empty state.
 * @param {Object} gameModel - The game model
 */
export function resetGameModel(gameModel) {
    gameModel.placedPieces.clear();
    gameModel.occupiedSquares.clear();
}

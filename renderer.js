// renderer.js - Canvas rendering functions for the polyomino calendar game
// All functions take explicit parameters (canvas context, state, config)

import { pieceToGridCoords, isValidPlacement } from './grid.js';
import { getPiece } from './pieces.js';

/**
 * Get grid position from canvas coordinates.
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @param {Object} config - { PADDING, SQUARE_SIZE }
 * @returns {Object} { row, col }
 */
export function getGridPos(canvasX, canvasY, config) {
    const { PADDING, SQUARE_SIZE } = config;
    const col = Math.floor((canvasX - PADDING) / SQUARE_SIZE);
    const row = Math.floor((canvasY - PADDING) / SQUARE_SIZE);
    return { row, col };
}

/**
 * Get the center square of a piece (for cursor placement).
 * @param {Array} coords - Piece coordinates
 * @returns {Array} [centerX, centerY]
 */
export function getPieceCenter(coords) {
    if (coords.length === 0) return [0, 0];

    const minX = Math.min(...coords.map(([x]) => x));
    const maxX = Math.max(...coords.map(([x]) => x));
    const minY = Math.min(...coords.map(([, y]) => y));
    const maxY = Math.max(...coords.map(([, y]) => y));

    const centerX = Math.round((minX + maxX) / 2);
    const centerY = Math.round((minY + maxY) / 2);

    // Find the closest square to this center point
    let closest = coords[0];
    let minDist = Math.pow(coords[0][0] - centerX, 2) + Math.pow(coords[0][1] - centerY, 2);

    for (const coord of coords) {
        const dist = Math.pow(coord[0] - centerX, 2) + Math.pow(coord[1] - centerY, 2);
        if (dist < minDist) {
            minDist = dist;
            closest = coord;
        }
    }
    return closest;
}

/**
 * Draw the calendar grid.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} grid - Grid data from gameModel
 * @param {Object} currentDate - { monthIndex, dayNumber }
 * @param {Object} config - { PADDING, SQUARE_SIZE, GRID_ROWS, GRID_COLS }
 */
export function drawGrid(ctx, grid, currentDate, config) {
    const { PADDING, SQUARE_SIZE, GRID_ROWS, GRID_COLS } = config;

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const square = grid[row][col];
            const x = PADDING + col * SQUARE_SIZE;
            const y = PADDING + row * SQUARE_SIZE;

            if (square.type === 'empty') {
                continue;
            }

            // Check if this is the current date
            const isCurrent = (square.type === 'month' && square.monthIndex === currentDate.monthIndex) ||
                             (square.type === 'day' && square.dayNumber === currentDate.dayNumber);

            // Draw background
            ctx.fillStyle = isCurrent ? '#fff3cd' : '#ffffff';
            ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);

            // Draw border
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, SQUARE_SIZE, SQUARE_SIZE);

            // Draw text
            ctx.fillStyle = isCurrent ? '#ff6b6b' : '#333';
            ctx.font = isCurrent ? 'bold 12px sans-serif' : '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(square.label, x + SQUARE_SIZE / 2, y + SQUARE_SIZE / 2);
        }
    }
}

/**
 * Draw a single piece on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} pieceCoords - Piece coordinates
 * @param {number} startRow - Grid row for origin
 * @param {number} startCol - Grid column for origin
 * @param {string} color - Piece color
 * @param {Object} config - { PADDING, SQUARE_SIZE }
 * @param {Object} options - { opacity, isHighlighted, isActive }
 */
export function drawPiece(ctx, pieceCoords, startRow, startCol, color, config, options = {}) {
    const { PADDING, SQUARE_SIZE } = config;
    const { opacity = 1, isHighlighted = false, isActive = false } = options;

    ctx.globalAlpha = opacity;

    // Use distinct color for active pieces
    if (isActive) {
        ctx.fillStyle = '#FF6B9D';  // Bright pink/magenta for active pieces
    } else {
        ctx.fillStyle = color;
    }

    pieceCoords.forEach(([x, y]) => {
        const gridRow = startRow + y;
        const gridCol = startCol + x;
        const canvasX = PADDING + gridCol * SQUARE_SIZE;
        const canvasY = PADDING + gridRow * SQUARE_SIZE;

        ctx.fillRect(canvasX, canvasY, SQUARE_SIZE, SQUARE_SIZE);

        // Draw highlight border
        if (isActive) {
            ctx.strokeStyle = '#C41E3A';  // Dark red for active piece border
            ctx.lineWidth = 3;
        } else if (isHighlighted) {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 4;
        } else {
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 2;
        }
        ctx.strokeRect(canvasX, canvasY, SQUARE_SIZE, SQUARE_SIZE);

        // Add diagonal pattern for active pieces
        if (isActive) {
            ctx.strokeStyle = 'rgba(196, 30, 58, 0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < SQUARE_SIZE; i += 4) {
                ctx.beginPath();
                ctx.moveTo(canvasX + i, canvasY);
                ctx.lineTo(canvasX + i + SQUARE_SIZE, canvasY + SQUARE_SIZE);
                ctx.stroke();
            }
        }
    });

    ctx.globalAlpha = 1;
}

/**
 * Draw placement indicator (crosshair) at cursor position.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} row - Grid row
 * @param {number} col - Grid column
 * @param {Object} config - { PADDING, SQUARE_SIZE }
 */
export function drawPlacementIndicator(ctx, row, col, config) {
    const { PADDING, SQUARE_SIZE } = config;
    const canvasX = PADDING + col * SQUARE_SIZE;
    const canvasY = PADDING + row * SQUARE_SIZE;

    // Draw a bright target circle at the tap point
    ctx.fillStyle = 'rgba(255, 107, 157, 0.3)';
    ctx.beginPath();
    ctx.arc(canvasX + SQUARE_SIZE / 2, canvasY + SQUARE_SIZE / 2, SQUARE_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw crosshairs
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = 2;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(canvasX + SQUARE_SIZE / 2, canvasY + 5);
    ctx.lineTo(canvasX + SQUARE_SIZE / 2, canvasY + SQUARE_SIZE - 5);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(canvasX + 5, canvasY + SQUARE_SIZE / 2);
    ctx.lineTo(canvasX + SQUARE_SIZE - 5, canvasY + SQUARE_SIZE / 2);
    ctx.stroke();
}

/**
 * Draw the preview of the selected piece at cursor position.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} uiState - { selectedPiece, selectedOrientation, mousePos }
 * @param {Set} occupiedSquares - Set of occupied square keys
 * @param {Object} config - { PADDING, SQUARE_SIZE }
 */
export function drawPreview(ctx, uiState, occupiedSquares, config) {
    if (!uiState.selectedPiece) return;

    const piece = getPiece(uiState.selectedPiece);
    const coords = piece.orientations[uiState.selectedOrientation];
    const { row, col } = getGridPos(uiState.mousePos.x, uiState.mousePos.y, config);

    // Adjust placement so cursor is on piece's center
    const [centerX, centerY] = getPieceCenter(coords);
    const adjustedRow = row - centerY;
    const adjustedCol = col - centerX;

    const gridCoords = pieceToGridCoords(coords, adjustedRow, adjustedCol);
    const isValid = isValidPlacement(gridCoords, occupiedSquares);

    // Draw active piece
    drawPiece(ctx, coords, adjustedRow, adjustedCol, piece.color, config, {
        opacity: isValid ? 1.0 : 0.5,
        isActive: true
    });

    // Draw placement indicator
    drawPlacementIndicator(ctx, row, col, config);
}

/**
 * Main render function - draws the entire game state.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} gameModel - { grid, placedPieces, occupiedSquares }
 * @param {Object} uiState - { selectedPiece, selectedOrientation, mousePos, highlightedPiece }
 * @param {Object} currentDate - { monthIndex, dayNumber }
 * @param {Object} config - { PADDING, SQUARE_SIZE, GRID_ROWS, GRID_COLS }
 */
export function render(ctx, canvas, gameModel, uiState, currentDate, config) {
    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, gameModel.grid, currentDate, config);

    // Draw placed pieces
    gameModel.placedPieces.forEach((placement, pieceName) => {
        const piece = getPiece(pieceName);
        const coords = piece.orientations[placement.orientationIndex];
        const isHighlighted = pieceName === uiState.highlightedPiece;
        drawPiece(ctx, coords, placement.row, placement.col, piece.color, config, {
            opacity: 0.8,
            isHighlighted
        });
    });

    // Draw preview of selected piece
    drawPreview(ctx, uiState, gameModel.occupiedSquares, config);
}

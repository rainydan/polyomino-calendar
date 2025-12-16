// inputHandlers.js - Input event handling for the polyomino calendar game
// Setup functions that attach event listeners with injected dependencies

import { pieceToGridCoords, isValidPlacement } from './grid.js';
import { getPiece } from './pieces.js';
import { placePiece, removePiece, checkWinCondition } from './gameLogic.js';
import { saveGameState } from './storage.js';
import { getPieceCenter } from './renderer.js';

/**
 * Trigger haptic feedback on supported devices.
 * @param {string} pattern - Pattern name or custom pattern
 * @returns {boolean} Whether vibration was triggered
 */
export function triggerHaptic(pattern = 'short') {
    if (!navigator.vibrate) return false;

    const patterns = {
        short: 10,           // Brief feedback for selection
        medium: 20,          // Medium feedback for actions
        success: [20, 10, 20], // Double tap for success
        error: [50, 30, 50],  // Stronger pattern for errors
        complete: [30, 50, 30, 50, 30] // Win celebration
    };

    navigator.vibrate(patterns[pattern] || pattern);
    return true;
}

/**
 * Get canvas coordinates from a mouse/touch event.
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} clientX - Client X coordinate
 * @param {number} clientY - Client Y coordinate
 * @returns {Object} { x, y } canvas coordinates
 */
export function getCanvasCoords(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

/**
 * Find which placed piece is at the given canvas position.
 * @param {number} canvasX - Canvas X coordinate
 * @param {number} canvasY - Canvas Y coordinate
 * @param {Map} placedPieces - Map of placed pieces
 * @param {Function} getGridPosFn - Function to convert canvas to grid coords
 * @returns {string|null} Piece name or null if none found
 */
export function getPlacedPieceAtPosition(canvasX, canvasY, placedPieces, getGridPosFn) {
    const { row, col } = getGridPosFn(canvasX, canvasY);

    for (const [pieceName, placement] of placedPieces) {
        const piece = getPiece(pieceName);
        const coords = piece.orientations[placement.orientationIndex];

        for (const [x, y] of coords) {
            if (placement.row + y === row && placement.col + x === col) {
                return pieceName;
            }
        }
    }
    return null;
}

/**
 * Setup canvas mouse/pointer event handlers.
 * @param {Object} deps - Dependencies
 * @param {HTMLCanvasElement} deps.canvas - Canvas element
 * @param {Object} deps.gameState - Game state object (for reading/writing)
 * @param {Object} deps.gameModel - Game model (domain state)
 * @param {Object} deps.currentDate - Current date object
 * @param {Function} deps.getGridPos - Grid position function
 * @param {Function} deps.draw - Draw function
 * @param {Function} deps.selectPiece - Piece selection function
 * @param {Function} deps.deselectPiece - Piece deselection function
 * @param {Function} deps.updatePieceTrayUI - UI update function
 * @param {Function} deps.showWinMessage - Win message function
 */
export function setupCanvasMouseHandlers(deps) {
    const {
        canvas, gameState, gameModel, currentDate, getGridPos,
        draw, selectPiece, deselectPiece, updatePieceTrayUI,
        showWinMessage
    } = deps;

    // Throttle state
    let lastDrawTime = 0;
    const DRAW_THROTTLE_MS = 16;

    // Touch movement tracking (shared with touch handlers)
    let touchMoved = false;

    // Track preview position for tap-in-place confirmation
    let previewRow = null;
    let previewCol = null;

    // Expose touchMoved setter for touch handlers
    deps.setTouchMoved = (value) => { touchMoved = value; };
    deps.getTouchMoved = () => touchMoved;

    // Expose preview position reset for rotation/flip/deselect
    deps.resetPreviewPosition = () => {
        previewRow = null;
        previewCol = null;
    };

    // Mouse move handler
    canvas.addEventListener('mousemove', (e) => {
        const coords = getCanvasCoords(canvas, e.clientX, e.clientY);
        gameState.mousePos = coords;

        const now = Date.now();
        if (now - lastDrawTime >= DRAW_THROTTLE_MS) {
            draw();
            lastDrawTime = now;
        }
    });

    // Click handler
    canvas.addEventListener('click', (e) => {
        const { x: canvasX, y: canvasY } = getCanvasCoords(canvas, e.clientX, e.clientY);

        // On touch devices, don't place if the user was moving their finger
        if (touchMoved) {
            touchMoved = false;
            return;
        }

        // Check if clicking on an already placed piece
        const clickedPiece = getPlacedPieceAtPosition(canvasX, canvasY, gameState.placedPieces, getGridPos);
        if (clickedPiece && !gameState.selectedPiece) {
            // Save the orientation before removing the piece
            const placement = gameModel.placedPieces.get(clickedPiece);
            const savedOrientation = placement ? placement.orientationIndex : 0;

            selectPiece(clickedPiece);

            // Restore the orientation after selectPiece (which resets it to 0)
            gameState.selectedOrientation = savedOrientation;

            // Reset preview position when picking up a piece
            previewRow = null;
            previewCol = null;

            removePiece(gameModel, clickedPiece);
            updatePieceTrayUI();
            draw();
            return;
        }

        if (!gameState.selectedPiece) return;

        const { row, col } = getGridPos(canvasX, canvasY);
        const piece = getPiece(gameState.selectedPiece);
        const coords = piece.orientations[gameState.selectedOrientation];

        const [centerX, centerY] = getPieceCenter(coords);
        const adjustedRow = row - centerY;
        const adjustedCol = col - centerX;

        const gridCoords = pieceToGridCoords(coords, adjustedRow, adjustedCol);

        if (isValidPlacement(gridCoords, gameState.occupiedSquares, currentDate)) {
            // Check if tapping in the same location (tap-in-place confirmation)
            const isSameLocation = (previewRow === adjustedRow && previewCol === adjustedCol);

            if (isSameLocation) {
                // Lock the piece on tap-in-place
                placePiece(gameModel, gameState.selectedPiece, adjustedRow, adjustedCol, gameState.selectedOrientation);

                document.getElementById(`piece-${gameState.selectedPiece}`).classList.remove('selected');
                gameState.selectedPiece = null;
                document.getElementById('selectedPiece').textContent = 'None';

                // Reset preview position
                previewRow = null;
                previewCol = null;

                triggerHaptic('success');
                updatePieceTrayUI();

                if (checkWinCondition(gameModel, currentDate)) {
                    triggerHaptic('complete');
                    showWinMessage();
                }

                saveGameState(gameModel, currentDate);
                draw();
            } else {
                // Just update preview position (don't lock)
                previewRow = adjustedRow;
                previewCol = adjustedCol;
                triggerHaptic('short');
                draw();
            }
        } else {
            triggerHaptic('error');
            canvas.classList.add('shake');
            setTimeout(() => canvas.classList.remove('shake'), 400);
        }
    });

    // Mouse leave handler
    canvas.addEventListener('mouseleave', (e) => {
        gameState.mousePos = { x: -1000, y: -1000 };

        const relatedTarget = e.relatedTarget;
        const isMovingToButton = relatedTarget && (
            relatedTarget.tagName === 'BUTTON' ||
            relatedTarget.closest('button') ||
            relatedTarget.classList?.contains('button-group') ||
            relatedTarget.classList?.contains('controls')
        );

        if (gameState.selectedPiece && !isMovingToButton && !gameState.isInteractingWithButton) {
            deselectPiece();
        }
        draw();
    });
}

/**
 * Setup canvas touch/gesture event handlers.
 * @param {Object} deps - Dependencies (same as setupCanvasMouseHandlers plus rotation functions)
 * @param {Function} deps.rotateClockwise - Rotation function
 * @param {Function} deps.flipPiece - Flip function
 */
export function setupCanvasTouchHandlers(deps) {
    const { canvas, gameState, draw, rotateClockwise, flipPiece } = deps;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    const SWIPE_THRESHOLD = 50;
    const SWIPE_TIME_THRESHOLD = 500;

    // Throttle state for touch rendering
    let lastTouchDrawTime = 0;
    const TOUCH_DRAW_THROTTLE_MS = 16; // 60fps

    canvas.addEventListener('touchstart', (e) => {
        if (!gameState.selectedPiece) return;

        // Prevent scrolling when a piece is selected
        e.preventDefault();

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        deps.setTouchMoved?.(false);

        // Update mouse position to touch position for rendering
        const coords = getCanvasCoords(canvas, touch.clientX, touch.clientY);
        gameState.mousePos = coords;
        draw();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (!gameState.selectedPiece) return;

        // Prevent scrolling when a piece is selected
        e.preventDefault();

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        if (deltaX > 5 || deltaY > 5) {
            deps.setTouchMoved?.(true);
        }

        // Update mouse position and redraw with throttling (60fps)
        const coords = getCanvasCoords(canvas, touch.clientX, touch.clientY);
        gameState.mousePos = coords;

        const now = Date.now();
        if (now - lastTouchDrawTime >= TOUCH_DRAW_THROTTLE_MS) {
            draw();
            lastTouchDrawTime = now;
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        if (!gameState.selectedPiece) return;

        const touch = e.changedTouches[0];
        const touchDuration = Date.now() - touchStartTime;

        if (touchDuration > SWIPE_TIME_THRESHOLD) return;

        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > SWIPE_THRESHOLD && absDeltaX > absDeltaY) {
            e.preventDefault();
            if (deltaX > 0) {
                const piece = getPiece(gameState.selectedPiece);
                gameState.selectedOrientation = (gameState.selectedOrientation - 1 + piece.orientations.length) % piece.orientations.length;
                triggerHaptic('medium');
                draw();
            } else {
                rotateClockwise();
            }
        } else if (absDeltaY > SWIPE_THRESHOLD && absDeltaY > absDeltaX) {
            e.preventDefault();
            if (deltaY < 0) {
                flipPiece();
            }
        }
    }, { passive: false });
}

/**
 * Setup keyboard event handlers.
 * @param {Object} deps - Dependencies
 */
export function setupKeyboardHandlers(deps) {
    const {
        gameState, gameModel, currentDate, getGridPos,
        draw, rotateClockwise, flipPiece, updatePieceTrayUI
    } = deps;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            rotateClockwise();
        } else if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            flipPiece();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const pieceAtMouse = getPlacedPieceAtPosition(
                gameState.mousePos.x,
                gameState.mousePos.y,
                gameState.placedPieces,
                getGridPos
            );
            if (pieceAtMouse) {
                removePiece(gameModel, pieceAtMouse);
                updatePieceTrayUI();
                document.getElementById('statusMessage').className = 'status-message';
                saveGameState(gameModel, currentDate);
                draw();
            }
        }
    });
}

/**
 * Setup mouse wheel handler for rotation.
 * @param {Object} deps - Dependencies
 */
export function setupWheelHandler(deps) {
    const { canvas, gameState, draw, rotateClockwise } = deps;

    canvas.addEventListener('wheel', (e) => {
        if (!gameState.selectedPiece) return;
        e.preventDefault();

        if (e.deltaY < 0) {
            rotateClockwise();
        } else {
            const piece = getPiece(gameState.selectedPiece);
            gameState.selectedOrientation = (gameState.selectedOrientation - 1 + piece.orientations.length) % piece.orientations.length;
            draw();
        }
    }, { passive: false });
}

/**
 * Setup right-click (context menu) handler for flip.
 * @param {Object} deps - Dependencies
 */
export function setupContextMenuHandler(deps) {
    const { canvas, gameState, flipPiece } = deps;

    canvas.addEventListener('contextmenu', (e) => {
        if (!gameState.selectedPiece) return;
        e.preventDefault();
        flipPiece();
    });
}

/**
 * Setup button interaction handlers to prevent piece deselection during button clicks.
 * @param {Object} deps - Dependencies
 * @param {Object} deps.gameState - Game state object
 */
export function setupButtonInteractionHandlers(deps) {
    const { gameState } = deps;

    document.querySelectorAll('button').forEach(button => {
        // Set flag on pointer/touch down
        button.addEventListener('pointerdown', () => {
            gameState.isInteractingWithButton = true;
        });
        button.addEventListener('touchstart', () => {
            gameState.isInteractingWithButton = true;
        });
        // Clear flag with a small delay to ensure button handler runs first
        button.addEventListener('click', () => {
            setTimeout(() => {
                gameState.isInteractingWithButton = false;
            }, 50);
        });
    });
}

/**
 * Setup all canvas input handlers.
 * @param {Object} deps - All dependencies
 * @returns {Object} Handlers object with resetPreviewPosition function
 */
export function setupAllCanvasHandlers(deps) {
    setupCanvasMouseHandlers(deps);
    setupCanvasTouchHandlers(deps);
    setupKeyboardHandlers(deps);
    setupWheelHandler(deps);
    setupContextMenuHandler(deps);
    setupButtonInteractionHandlers(deps);

    // Return helper functions for external use
    return {
        resetPreviewPosition: deps.resetPreviewPosition || (() => {})
    };
}

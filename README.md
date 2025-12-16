# Polyomino Calendar Puzzle

A web-based puzzle game where you place polyomino pieces to cover a calendar, leaving only today's date uncovered.

Play it at [rainydan.com](https://polycal.rainydan.com)

## How to Run

The game must be served over HTTP (not opened directly as a file) due to JavaScript ES module requirements.

### Using Python
```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

### Using Node.js (if installed)
```bash
npx http-server
```

## Gameplay

- **Goal**: Place all 8 pieces on the calendar grid to cover every day and month except today's date
- **Select a piece**: Click/tap on any piece in the "Pieces to Place" panel on the right

### Desktop Controls
- **Place a piece**: Click on the calendar grid to lock it in place
- **Rotate**: Press **R** key, use mouse wheel, or click "↻ Rotate" button
- **Flip**: Press **F** key, right-click, or click "↔ Flip" button
- **Reposition**: Click on a placed piece to pick it up and move it
- **Reset**: Click "Reset" to clear the board and start over

### Mobile Controls
- **Preview placement**: Tap on the calendar grid to preview piece position (shows green/red crosshair)
- **Lock piece**: Long press (500ms) on a valid position to lock it in place
- **Rotate**: Swipe left or right on the grid
- **Flip**: Swipe up on the grid
- **Reposition**: Tap on a placed piece to pick it up
- **Reset**: Tap "Reset" to clear the board and start over

## Technical Details

- **Grid**: 6 rows × 8 columns (48 squares total)
- **Calendar Layout**: 12 months (centered) + 31 days
- **Pieces**: 7 pentominoes (L, N, P, U, V, Y, Z) + 1 hexomino (Rectangle)
- **Game State**: Auto-saves to browser localStorage

## Project Structure

- `index.html` - Main game interface and canvas rendering
- `grid.js` - Calendar grid layout and placement validation
- `pieces.js` - Polyomino piece definitions and orientations

## AI disclosure

Most of this game is made via conversation with the coding agent [Amp](https://ampcode.com/) by Sourcegraph in /free mode, and Claude Code in cheap mode.

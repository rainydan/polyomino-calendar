# Polyomino Calendar Puzzle - Design Document

## Overview

A web-based interactive puzzle game where players use polyomino pieces to cover a calendar grid, leaving only the current date uncovered. The puzzle automatically resets daily, providing a fresh puzzle each day.

## Core Concept

### The Calendar Grid
- **Months**: 12 squares representing January through December
- **Days**: 31 squares representing days 1-31
- **Total Grid**: 43 squares arranged in an approximately rectangular contiguous layout
- **Daily Goal**: Cover all 41 squares except the current month and day using polyomino pieces

### Polyomino Pieces
- **11 Pentominoes**: Standard 5-square polyomino pieces (covers 55 squares total)
- **1 Hexomino**: A 2×3 rectangle (covers 6 squares)
- **Total Coverage**: 55 + 6 = 61 squares of piece area, with 20 squares extending off the calendar grid
- **Piece Design**: Each piece has a unique shape and color for visual distinction

## Game Rules

1. **Objective**: Place all pieces on the calendar grid to cover all month and day squares except the current month and day
2. **Valid Placement**: Pieces must not overlap and must remain fully within the puzzle boundary
3. **Each Piece Only Once**: Each piece can only be selected from the tray and placed once. Once a piece is placed, it cannot be selected again from the tray. However, placed pieces can be clicked on the board to pick them up and reposition them.
4. **Piece Rotation**: Pieces can be rotated (and potentially flipped) before placement
5. **Win Condition**: All 41 required squares are covered and no pieces are off the grid
6. **Daily Reset**: Puzzle resets at midnight (local time), creating a new daily puzzle based on the current date
7. **Hints/Undo**: Optional features for gameplay assistance

## Placement Preview & Validation

### Snap-to-Grid with Preview
When a piece is selected and the user hovers over the grid:
- **Shadow preview**: Display a semi-transparent preview of where all piece squares will land
- **Live validation**: Update preview as mouse moves across grid
- **Placement validation**: Only allow placement if:
  - All piece squares fall within valid grid boundaries
  - No overlap with already-placed pieces
  - No obstruction by the "current date" unavailable square
- **Visual feedback**: Gray out preview when placement is invalid, show at full opacity when valid
- **Click placement**: Clicking places the piece only if the preview is valid

## Grid Layout

The calendar grid uses a custom layout that efficiently arranges 12 months and 31 days in an approximately rectangular shape. The exact layout should be designed to:
- Minimize wasted space
- Create an aesthetically pleasing rectangular appearance
- Provide a good fit with the polyomino pieces

### Proposed Layout (9×5 grid with 43 filled squares):
```
[Month Grid - 12 squares]
[Day Grid - 31 squares]
[Flexible arrangement to accommodate polyominoes]
```

*Exact grid coordinates should be defined during implementation.*

## Technical Design Decisions

### Piece Definitions

**Selected Polyominoes**: 
- **Pentominoes**: L, N, P, U, V, Y, Z (7 pieces × 5 squares = 35 squares)
- **Hexomino**: 2×3 Rectangle (1 piece × 6 squares = 6 squares)
- **Total**: 41 squares (exactly covers the calendar: 12 months + 31 days - 2 for current date)

**Rationale**: This specific set of 7 pentominoes and the rectangle hexomino was chosen based on historical use in the original physical polyomino calendar puzzle. The set provides good puzzle difficulty and variety of shapes.

### Coordinate Representation

**System**: Relative offset coordinates from an origin point (0, 0)
- Each piece stores its squares as `[x, y]` coordinate pairs
- Coordinates are normalized to fit within the piece's bounding box
- Example: L-pentomino = `[[0,0], [1,0], [2,0], [3,0], [0,1]]`

**Advantages**:
- Decouples piece definition from grid position
- Simplifies rotation and flip transformations
- Facilitates collision detection and boundary checking

### Orientation System

**Approach**: All unique orientations (rotations + flips) are pre-computed at load time

**Generation Algorithm**:
1. Generate 4 rotations of the base piece (0°, 90°, 180°, 270°)
2. Generate 4 rotations of the flipped piece
3. Deduplicate identical orientations (pieces with symmetry have fewer unique states)
4. Store all unique orientations in a `.orientations` array

**Example**: 
- L-pentomino: 8 unique orientations (4 rotations × 2 mirror images)
- U-pentomino: 4 unique orientations (symmetric, so some flips match rotations)
- Rectangle hexomino: 2 unique orientations (3×2 and 2×3)

**Benefits**:
- User can rotate pieces 90° at a time and flip them freely
- No need to compute transformations during gameplay
- Clear API: `nextOrientation()` and `prevOrientation()` for cycling through states

### Grid Coordinate System

*To be determined during grid layout implementation*

Considerations:
- Should support efficient collision detection
- Grid indices should map clearly to calendar squares
- Should accommodate polyomino piece placement validation

## User Interface

### Main Components
1. **Game Board**: Central interactive canvas displaying the calendar grid and pieces
2. **Piece Tray**: Collection of unplaced pieces ready for selection and placement
3. **Current Date Display**: Shows today's month and day (the "empty" squares)
4. **Game Status**: Visual feedback on completion percentage or remaining pieces
5. **Controls**:
   - Piece selection
   - Rotation controls (keyboard or buttons)
   - Reset puzzle (clear all pieces and start over)
   - Hint system (optional)

### Interactions
- **Placement Model**: Click piece, then click grid square to place
  - User selects a piece from the tray (visual feedback shows selection)
  - User clicks a target grid square to place the piece
  - Piece appears at the clicked location with its current orientation
  - Click another piece to deselect and select a new one
  - **Piece Repositioning**: Placed pieces can be clicked directly on the board to pick them up and reposition them
  - **One-time Tray Selection**: Once a piece is placed, it cannot be selected again from the tray. Only placed pieces can be picked up from the board for repositioning

- **Rotation/Flip Controls** (while a piece is selected):
  - **Keyboard**: 
    - R: Rotate 90° clockwise
    - F: Flip horizontally (mirror: left ↔ right)
  - **Mouse**:
    - Mouse wheel up: Rotate 90° clockwise
    - Mouse wheel down: Rotate 90° counterclockwise
    - Right click: Flip horizontally (mirror: left ↔ right)

### Invalid Placement Feedback
- **Color change**: Preview shadow changes color based on validity
  - Valid placement: Full opacity, normal piece color
  - Invalid placement: Grayed out or red tint to indicate obstruction
- **Shake animation**: When user clicks an invalid placement location, the selected piece shakes (300-400ms duration) to indicate rejection
- **Clear visual distinction**: User immediately sees if a placement is possible before attempting to click

- Highlight "current date" square for emphasis

## Win State UX and Celebrations

### Win Condition Detection
- Game detects when all 41 required squares (12 months + 31 days - current month - current day) are covered by placed pieces
- Check occurs after every piece placement
- Prevents further piece placement once puzzle is solved

### Visual Feedback on Completion
- **Success Message**: Display prominent "🎉 Congratulations! You solved the puzzle!" message
  - Centered on screen in a success-styled box (green background, dark text)
  - Message remains visible after completion
  - Clear visual celebration of achievement

- **Appearance Changes**:
  - Board state is frozen (no further interaction possible)
  - All pieces remain visible in their final positions
  - Current date square remains highlighted as empty

### Celebration Effects (Progressive Enhancement)
- **Level 1 - MVP**: Static success message with green styling
- **Level 2 - Polish**: Optional confetti animation or subtle background color change
- **Level 3 - Enhancement**: Sound effects (optional, with mute option), particle effects, or other visual flourishes

### Statistics Recording
- **Automatic Recording**: Upon win, game automatically logs:
  - Solve time (elapsed seconds from page load or game start)
  - Current date solved (month-day combination)
  - Timestamp of completion
  - Win is marked in statistics for that day

- **Statistics Display** (future):
  - Show current streak count
  - Display personal best time for the day
  - Link to statistics dashboard or summary

### Post-Win Options (Future Enhancement)
- **Share Results**: Copy solve time and date to clipboard or generate sharable text
- **New Game**: Link to refresh page for next day's puzzle (if date hasn't changed)
- **Statistics**: Quick link to view win history and streaks

## Technical Architecture

### Technology Stack
- **Frontend Framework**: Vue.js, React, or vanilla JavaScript (SPA)
- **Rendering**: **Canvas** for interactive puzzle display
- **Storage**: Browser localStorage for statistics and game state
- **Hosting**: Static file hosting (GitHub Pages, Netlify, Vercel, or similar)

### Rendering Technology Decision: Canvas
**Chosen**: Canvas
**Rationale**: 
- Provides smooth, performant rendering for piece interactions (drag, rotate, snap-to-grid)
- Simple API for drawing grids, rectangles, and custom piece shapes
- Well-suited for 2D game mechanics and hit detection
- Native support across all modern browsers
- No dependency overhead compared to SVG libraries

### Core Modules
1. **Grid System**: Manages calendar grid state, piece positions, collision detection
2. **Piece Library**: Defines all 12 polyomino shapes with rotation states
3. **Game Logic**: Rules validation, win condition checking, daily reset
4. **UI Renderer**: Visual display and interaction handling
5. **Storage Manager**: localStorage persistence for stats and saved games

### No Backend Required
- All game logic runs client-side
- Datetime logic uses client system time
- No user authentication needed for basic gameplay

## Data Storage (localStorage)

### Game State
- Current puzzle state (piece placements)
- Can be cleared daily or persist for session

### Statistics & Streaks
```json
{
  "gamesPlayed": 42,
  "gamesWon": 38,
  "currentStreak": 7,
  "longestStreak": 12,
  "lastPlayedDate": "2025-11-18",
  "personalBest": 145,
  "stats": {
    "2025-11-18": {
      "solved": true,
      "timeSeconds": 245,
      "timestamp": 1731953400000
    }
  }
}
```

### Features
- Track daily play history
- Maintain win streak counting
- Store personal best solve times
- Remember user preferences (theme, piece size, etc.)

## Gameplay Flow

1. **Game Load**: Check if today's date matches last played date
   - If different date: present fresh puzzle
   - If same date: optionally restore previous game state
2. **Gameplay**: User places pieces until puzzle is solved or gives up
3. **Win State**: Display completion message, record stats, offer share/replay
4. **Daily Reward**: Optional streak/statistics display
5. **Auto-Reset**: Midnight (local time) triggers fresh puzzle

## Future Enhancements

- **Undo/Redo Stack**: Full history of moves with ability to rewind to any game state
- **Difficulty Levels**: Hint system, move counter, time limits
- **Multiplayer**: Shared puzzle links or async race mode
- **Social Features**: Share solve times or completion screenshots
- **Accessibility**: Keyboard-only controls, screen reader support, high contrast mode
- **Mobile Optimization**: Touch-friendly controls and responsive design
- **Sound Effects**: Optional audio feedback for piece placement and completion
- **Analytics**: Non-identifying usage analytics (if hosted) to track engagement

## Implementation Phases

### Phase 1: MVP
- [x] Grid layout with month/day squares
- [x] 8 polyomino pieces with shapes and colors (7 pentominoes + 1 hexomino)
- [x] Basic placement mechanics (click-to-place with preview)
- [x] Rotation controls (keyboard: R, button, or wheel)
- [x] Flip controls (keyboard: F, button, or right-click)
- [x] Piece repositioning (click placed pieces to move them)
- [x] Win condition detection
- [x] localStorage for game state and statistics
- [x] Invalid placement feedback (shake animation)
- [x] Piece selection with visual feedback

### Phase 2: Polish
- [ ] Daily reset logic (automatic at midnight)
- [ ] Mobile responsiveness
- [ ] Additional animation and visual feedback
- [ ] Timer for solve time tracking
- [ ] Improved piece tray UI (show placed status)
- [ ] Hint system (optional)

### Phase 3: Enhancement
- [ ] Social sharing features
- [ ] Accessibility improvements
- [ ] Sound effects (optional)
- [ ] Theme customization
- [ ] Analytics

## Deployment

- **Host**: Static hosting platform (GitHub Pages, Netlify, Vercel, etc.)
- **Domain**: Custom domain if desired
- **Distribution**: Direct link sharing, social media embedding
- **No backend requirements**: Simplifies deployment and operations

## References

- Pentomino Wikipedia: https://en.wikipedia.org/wiki/Pentomino
- Polyomino Calendar Puzzle History: Traditional wood/cardboard puzzle game since 1967

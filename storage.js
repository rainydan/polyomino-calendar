// storage.js - localStorage persistence for game state and stats
// All functions are pure with respect to external state (no global dependencies)

// Storage keys
const STORAGE_GAME_STATE = 'polyomino-game-state';
const STORAGE_STATS = 'polyomino-stats';
const STORAGE_LAST_DATE = 'polyomino-last-date';

/**
 * Save the current game state to localStorage.
 * @param {Object} gameModel - The game model containing placedPieces and occupiedSquares
 * @param {Object} currentDate - { monthIndex, dayNumber }
 */
export function saveGameState(gameModel, currentDate) {
    const gameData = {
        date: `${currentDate.monthIndex}-${currentDate.dayNumber}`,
        placedPieces: Array.from(gameModel.placedPieces.entries()),
        occupiedSquares: Array.from(gameModel.occupiedSquares)
    };
    try {
        localStorage.setItem(STORAGE_GAME_STATE, JSON.stringify(gameData));
    } catch (e) {
        console.error('Failed to save game state:', e);
    }
}

/**
 * Load game state from localStorage.
 * @param {Object} currentDate - { monthIndex, dayNumber }
 * @returns {Object|null} Loaded game data { placedPieces, occupiedSquares } or null if not found/invalid
 */
export function loadGameState(currentDate) {
    const saved = localStorage.getItem(STORAGE_GAME_STATE);
    if (!saved) return null;

    try {
        const gameData = JSON.parse(saved);
        // Only return if it's for today
        if (gameData.date === `${currentDate.monthIndex}-${currentDate.dayNumber}`) {
            return {
                placedPieces: gameData.placedPieces || [],
                occupiedSquares: gameData.occupiedSquares || []
            };
        }
    } catch (e) {
        console.error('Failed to load game state:', e);
    }
    return null;
}

/**
 * Clear saved game state from localStorage.
 */
export function clearGameState() {
    localStorage.removeItem(STORAGE_GAME_STATE);
}

/**
 * Check if we should reset for a new day.
 * @param {Object} currentDate - { monthIndex, dayNumber }
 * @returns {boolean} True if the last played date differs from today
 */
export function shouldResetForNewDay(currentDate) {
    const lastDate = localStorage.getItem(STORAGE_LAST_DATE);
    const today = `${currentDate.monthIndex}-${currentDate.dayNumber}`;

    if (!lastDate) return false; // First time, no reset needed
    return lastDate !== today;
}

/**
 * Update the last played date to today.
 * @param {Object} currentDate - { monthIndex, dayNumber }
 */
export function setLastPlayedDate(currentDate) {
    localStorage.setItem(STORAGE_LAST_DATE, `${currentDate.monthIndex}-${currentDate.dayNumber}`);
}

/**
 * Get default stats structure.
 * @returns {Object} Empty stats object
 */
function getDefaultStats() {
    return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDate: null,
        personalBest: 999999,
        stats: {}
    };
}

/**
 * Load stats from localStorage.
 * @returns {Object} Stats object (default if not found)
 */
export function loadStats() {
    try {
        const saved = localStorage.getItem(STORAGE_STATS);
        if (saved) {
            return { ...getDefaultStats(), ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
    return getDefaultStats();
}

/**
 * Save stats after a game.
 * @param {boolean} solved - Whether the puzzle was solved
 * @param {number} timeSeconds - Time taken to solve (0 if not solved)
 * @param {Object} currentDate - { monthIndex, dayNumber }
 */
export function saveStats(solved, timeSeconds, currentDate) {
    let stats = loadStats();

    const dateKey = `${currentDate.monthIndex + 1}-${currentDate.dayNumber}`;

    if (!stats.stats[dateKey]) {
        stats.gamesPlayed++;
        stats.stats[dateKey] = {};
    }

    if (solved) {
        stats.gamesWon++;
        stats.stats[dateKey].solved = true;
        stats.stats[dateKey].timeSeconds = timeSeconds;

        // Update streak
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        const yesterdayKey = `${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

        if (stats.lastPlayedDate === yesterdayKey && stats.stats[yesterdayKey]?.solved) {
            stats.currentStreak++;
        } else {
            stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }

        if (timeSeconds < stats.personalBest) {
            stats.personalBest = timeSeconds;
        }
    }

    stats.lastPlayedDate = dateKey;
    stats.stats[dateKey].timestamp = new Date().getTime();

    try {
        localStorage.setItem(STORAGE_STATS, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save stats:', e);
    }
}

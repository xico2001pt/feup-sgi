/**
 * Model that represents the game time tracker
 */
export class MyGameTimeTracker {
    /**
     * @param {Number} maxGametime - Maximum game time in milliseconds
     * @param {Number} maxRoundtime - Maximum round time in milliseconds
     */
    constructor(maxGametime, maxRoundtime) {
        this.gametime = [0, 0];
        this.roundtime = [0, 0];
        this.maxGametime = maxGametime;
        this.maxRoundtime = maxRoundtime;
    }

    /**
     * Resets the round timer
     */
    resetRoundtime() {
        this.roundtime = [0, 0];
    }

    /**
     * Increments the time for a player
     * @param {Number} playerId - Player id
     * @param {Number} timeIncrement - Time increment in milliseconds
     */
    incrementTime(playerId, timeIncrement) {
        this.gametime[playerId] += timeIncrement;
        this.roundtime[playerId] += timeIncrement;
    }

    /**
     * Checks if the game is over
     * The game is over if the maximum game time or round time is reached
     * @returns {Boolean} True if the game is over, false otherwise
     */
    isGameover() {
        return this.gametime[0] >= this.maxGametime || this.gametime[1] >= this.maxGametime ||
            this.roundtime[0] >= this.maxRoundtime || this.roundtime[1] >= this.maxRoundtime;
    }

    /**
     * Gets the round time for a player
     * @param {Number} playerId - Player id
     * @returns {Array} - Array with the minutes and seconds
     */
    getRoundTime(playerId) {
        return [Math.floor(this.roundtime[playerId] / (1000 * 60)), Math.floor(this.roundtime[playerId] / 1000) % 60];
    }

    /**
     * Gets the game time for a player
     * @param {Number} playerId - Player id
     * @returns {Array} - Array with the minutes and seconds
     */
    getGameTime(playerId) {
        return [Math.floor(this.gametime[playerId] / (1000 * 60)), Math.floor(this.gametime[playerId] / 1000) % 60];
    }
}
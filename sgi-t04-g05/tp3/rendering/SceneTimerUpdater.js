/**
 * Class responsible for updating the timer
 */
export class SceneTimerUpdater {
    /**
     * Updates the timer
     * @param {XMLScene} scene - Reference to the XMLScene
     * @param {Array} timeTracker - Array with the minutes and seconds
     * @param {Number} playerId - Id of the player
     */
    static update(scene, timetracker, playerId) {
        SceneTimerUpdater.updateTimer(scene, timetracker.getRoundTime(playerId), "round_timer");
        SceneTimerUpdater.updateTimer(scene, timetracker.getGameTime(playerId), "game_timer");
    }

    /**
     * Updates the timer
     * @param {XMLScene} scene - Reference to the XMLScene
     * @param {Array} values - Array with the minutes and seconds
     * @param {String} timerId - Id of the timer
     */
    static updateTimer(scene, values, timerId) {
        const timer = scene.sceneData.primitives[timerId].object;

        const minutes = String(values[0]).padStart(2, '0');
        const seconds = String(values[1]).padStart(2, '0');
        timer.setDigit(0, minutes[0]);
        timer.setDigit(1, minutes[1]);
        timer.setDigit(2, seconds[0]);
        timer.setDigit(3, seconds[1]);
    }
}
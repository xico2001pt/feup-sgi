/**
 * Class responsible for updating the score
 */
export class SceneScoreUpdater {
    /**
     * Updates the score
     * @param {XMLScene} scene - Reference to the XMLScene
     * @param {Number} player0Score - Score of player 0
     * @param {Number} player1Score - Score of player 1
     */
    static update(scene, player0Score, player1Score) {
        const counter = scene.sceneData.primitives["game_score"].object;

        let scoreString = String(player0Score).padStart(2, '0');
        counter.setDigit(0, scoreString[0]);
        counter.setDigit(1, scoreString[1]);
        scoreString = String(player1Score).padStart(2, '0');
        counter.setDigit(2, scoreString[0]);
        counter.setDigit(3, scoreString[1]);
    }
}
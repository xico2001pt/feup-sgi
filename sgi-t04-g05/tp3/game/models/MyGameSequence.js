/**
 * Model class for a sequence of moves.
 * This is used to store the moves of a game.
 */
export class MyGameSequence {
    constructor() {
        this.moves = [];
    }

    /**
     * Adds a move to the sequence
     * @param {MyGameMove} move - Move to add
     */
    addMove(move) {
        this.moves.push(move);
    }

    /**
     * Pops the last move of the sequence
     * @returns {MyGameMove} - Last move
     */
    popLastMove() {
        return this.moves.pop();
    }

    /**
     * Pops the first move of the sequence
     * @returns {MyGameMove} - First move
     */
    popFirstMove() {
        return this.moves.shift();
    }

    /**
     * Clones the game sequence
     * @returns {MyGameSequence} - Cloned sequence
     */
    clone() {
        const newSequence = new MyGameSequence();
        for (const move of this.moves) {
            newSequence.addMove(move.clone());
        }
        return newSequence;
    }
}
/**
 * Model class that represents a game move
 */
export class MyGameMove {
    /**
     * @param {MyTile} startTile - Start tile
     * @param {MyTile} endTile - End tile
     * @param {Boolean} inMovementChain - True if the move is part of a movement chain
     * @param {Boolean} switchedPlayer - True if the player switched
     * @param {Boolean} becameKing - True if the piece became a king
     */
    constructor(startTile, endTile, inMovementChain=false, switchedPlayer=false, becameKing=false) {
        this.startTile = startTile;
        this.endTile = endTile;
        this.inMovementChain = inMovementChain;
        this.switchedPlayer = switchedPlayer;
        this.becameKing = becameKing;
    }

    /**
     * Clones the move
     * @returns {MyGameMove} - Cloned move
     */
    clone() {
        return new MyGameMove(this.startTile, this.endTile, this.inMovementChain, this.switchedPlayer, this.becameKing);
    }
}
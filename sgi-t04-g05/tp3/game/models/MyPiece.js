/**
 * Model that represents a game piece
 */
export class MyPiece {
    /**
     * @param {*} scene - Reference to MyScene object
     * @param {Number} playerId - Player id
     * @param {Number} pieceId - Piece id
     */
    constructor(scene, playerId, pieceId) {
        this.scene = scene;
        this.tile = null;
        this.playerId = playerId;
        this.isKing = false;
        this.id = pieceId;
    }

    /**
     * Upgrades the piece to a king
     */
    upgrade() {
        this.isKing = true;
    }

    /**
     * Sets the tile where the piece is at
     * @param {MyTile} tile - Tile
     */
    setTile(tile) {
        this.tile = tile;
    }

    /**
     * Clears the tile where the piece is at
     */
    clearTile() {
        this.tile = null;
    }
}
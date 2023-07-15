/**
 * Model that represents a game tile
 */
export class MyTile {
    /**
     * @param {*} scene - Reference to MyScene object
     * @param {Number} col - Column
     * @param {Number} row - Row
     */
    constructor(scene, col, row) {
        this.scene = scene;
        this.row = row;
        this.col = col;
        this.piece = null;
    }

    /**
     * Checks if the tile has a piece on it
     * @returns {Boolean} True if the tile has a piece on it, false otherwise
     */
    isOccupied() {
        return this.piece != null;
    }

    /**
     * Sets the piece on the tile
     * @param {MyPiece} piece - Piece
     */
    setPiece(piece) {
        this.piece = piece;
    }

    /**
     * Clears the piece on the tile
     */
    clearPiece() {
        this.piece = null;
    }
}
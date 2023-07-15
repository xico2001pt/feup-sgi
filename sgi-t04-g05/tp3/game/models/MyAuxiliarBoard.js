import { MyTile } from "./MyTile.js";

/**
 * Model that represents the auxiliar board where the captured pieces are stored
 */
export class MyAuxiliarBoard {
    /**
     * @param {*} scene - Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.board = [];
        this.initializeBoard(0);
        this.initializeBoard(1);
    }

    /**
     * Initializes the board for a player
     * @param {Number} playerId - Player id
     */
    initializeBoard(playerId) {
        let playerBoard = [];
        for (let i = 0; i < 12; ++i) {
            playerBoard.push(new MyTile(this.scene, -2 + playerId * 11, playerId == 0 ? i - 2 : 9 - i));
        }
        this.board.push(playerBoard);
    }

    /**
     * Checks if the board is full for a player
     * @param {Number} playerId - Player id
     * @returns {Boolean} - True if the board is full, false otherwise
     */
    isFull(playerId) {
        return this.getScore(playerId) == 12;
    }
    
    /**
     * Gets the score for a player
     * @param {Number} playerId - Player id
     * @returns {Number} - Score
     */
    getScore(playerId) {
        return this.board[1-playerId].filter(tile => tile.piece != null).length;
    }

    /**
     * Gets the first available tile for a piece
     * @param {MyPiece} piece - Piece
     * @returns {MyTile} - Tile
     */
    getAvailableTile(piece) {
        for (const tile of this.board[piece.playerId]) {
            if (!tile.isOccupied()) {
                return tile;
            }
        }
    }

    /**
     * Removes the most recent piece for a player
     * @param {Number} playerId - Player id
     * @returns {MyPiece} - Piece
     */
    popPiece(playerId) {
        for (let i = this.board[0].length-1; i >= 0; --i) {
            const piece = this.board[playerId][i].piece;
            if(piece) {
                this.board[playerId][i].piece = null;
                return piece;
            }
        }
        return null;
    }
}
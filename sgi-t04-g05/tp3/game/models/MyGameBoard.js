import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";

const NUM_ROWS = 8;
const NUM_COLS = 8;

/**
 * Model that represents the game board
 */
export class MyGameBoard {
    /**
     * @param {*} scene - Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.setupBoard();
        this.setupPieces();
    }

    /**
     * Initializes the board
     */
    setupBoard() {
        this.board = [];
        for (let i = 0; i < NUM_ROWS; ++i) {
            let row = [];
            for (let j = 0; j < NUM_COLS; ++j) {
                row.push(new MyTile(this.scene, j, i));
            }
            this.board.push(row);
        }
    }

    /**
     * Initializes the pieces
     */
    setupPieces() {
        this.pieces = [];
        for (let i = 0; i < NUM_COLS/2; i++){
            this.addPiece(new MyPiece(this.scene, 0, i*6), this.board[0][2*i+1]);
            this.addPiece(new MyPiece(this.scene, 0, i*6+1), this.board[1][2*i]);
            this.addPiece(new MyPiece(this.scene, 0, i*6+2), this.board[2][2*i+1]);
            this.addPiece(new MyPiece(this.scene, 1, i*6+3), this.board[7][2*i]);
            this.addPiece(new MyPiece(this.scene, 1, i*6+4), this.board[6][2*i+1]);
            this.addPiece(new MyPiece(this.scene, 1, i*6+5), this.board[5][2*i]);
        }

        for (let i = 0; i < NUM_ROWS; ++i) {
            for (let j = 0; j < NUM_COLS; ++j) {
                const tile = this.board[i][j];
                if(tile.piece) {
                    this.pieces.push(tile.piece);
                }
            }
        }        
    }

    /**
     * Gets the pieces for a player
     * @param {Number} playerId - Player id
     * @returns {Array} - Pieces
     */
    getPiecesByPlayer(playerId) {
        return this.pieces.filter(piece => piece.playerId == playerId);
    }

    /**
     * Adds a piece to a tile
     * @param {MyPiece} piece - Piece
     * @param {MyTile} tile - Tile
     */
    addPiece(piece, tile) {
        tile.setPiece(piece);
        piece.setTile(tile);
    }
    
    /**
     * Removes a piece from a tile
     * @param {MyTile} tile - Tile
     */
    removePiece(tile) {
        const piece = tile.piece;
        if (piece) {
            piece.clearTile();   
        }
        tile.clearPiece();
    }

    /**
     * Removes a piece from the board pieces list
     * @param {MyPiece} piece - Piece
     * @returns {Array} - Pieces
     */
    removeFromPlay(piece) {
        this.pieces = this.pieces.filter(p => p != piece);
    }

    /**
     * Moves a piece to a destination tile
     * @param {MyPiece} piece - Piece
     * @param {MyTile} destinationTile - Destination tile
     */
    movePiece(piece, destinationTile) {
        const startingTile = piece.tile;
        this.removePiece(startingTile);
        this.addPiece(piece, destinationTile);
    }

    /**
     * Gets the tile at a given position
     * @param {Number} row - Row
     * @param {Number} col - Column
     * @returns {MyTile} - Tile
     */
    getTile(row, col){
        if(this.board[row]) {
            return this.board[row][col];
        }
        return null;
    }
}
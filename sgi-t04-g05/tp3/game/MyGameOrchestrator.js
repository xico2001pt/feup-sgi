import { MyGameBoard } from "./models/MyGameBoard.js";
import { MyAuxiliarBoard } from "./models/MyAuxiliarBoard.js";
import { MyGameMove } from "./models/MyGameMove.js";
import { MyGameSequence } from "./models/MyGameSequence.js";
import { MyGameTimeTracker } from "./models/MyGameTimeTracker.js";
import { SceneScoreUpdater } from "../rendering/SceneScoreUpdater.js";

/**
 * Class that contains all the game logic.
 */
export class MyGameOrchestrator {
    /**
     * @param {MyScene} scene - Reference to MyScene object.
     */
    constructor(scene) {
        this.scene = scene;
        this.board = new MyGameBoard(scene);
        this.auxiliaryBoard = new MyAuxiliarBoard(scene);
        this.currentPlayer = 0;
        this.selectedPiece = null;
        this.gameSequence = new MyGameSequence();
        this.timetracker = new MyGameTimeTracker(15*60*1000, 60*1000);
        this.warningMessage = false;
    }

    /**
     * Switches the current player.
     */
    switchPlayer() {
        this.timetracker.resetRoundtime();
        this.currentPlayer = 1 - this.currentPlayer;
        this.scene.sceneData.components["current_player"].texture = this.scene.sceneData.textures["tex_player" + this.currentPlayer];
    }

    /**
     * Enables the warning display.
     */
    displayWarning(message) {
        this.warningMessage = message;
    }

    /**
     * Disables the warning display.
     */
    removeWarning() {
        this.warningMessage = null;
    }

    /**
     * Checks if the piece can be picked.
     * @param {MyGamePiece} piece - Piece to be checked.
     * @returns {boolean} - True if the piece can be picked, false otherwise.
     */
    canPickPiece(piece) {
        if (piece.playerId != this.currentPlayer) return false;

        const possibleCaptures = this.getPossibleCaptures();
        if (Object.keys(possibleCaptures).length > 0) {
            return possibleCaptures[this.getTileIdentifier(piece.tile)] != null;
        }
        return true;
    }

    /**
     * Picks a piece.
     * @param {MyGamePiece} piece - Piece to be picked.
     */
    pickPiece(piece) {
        this.selectedPiece = piece;
    }
    
    /**
     * Unpicks a piece.
     */
    unpickPiece() {
        this.selectedPiece = null;
    }

    /**
     * Moves a piece to a target tile.
     * @param {MyGamePiece} piece - Piece to be moved.
     * @param {MyGameTile} targetTile - Target tile.
     * @param {boolean} inMovementChain - True if the move is part of a movement chain, false otherwise.
     * @returns {boolean} - True if the move was successful, false otherwise.
     */
    movePiece(piece, targetTile, inMovementChain) {
        if (this._canMovePieceToTile(piece, targetTile)) {
            const startTile = piece.tile;
            const capturedPiece = this.capturePieceBetweenTiles(startTile, targetTile);
            this.board.movePiece(piece, targetTile);

            let becameKing = false;
            if(!piece.isKing && (targetTile.row == 0 || targetTile.row == 7)) {
                becameKing = true;
                piece.upgrade();
            }
        
            const switchPlayer = !(this.pieceHasCaptureAvailable(piece) && capturedPiece);
            this.gameSequence.addMove(new MyGameMove(startTile, targetTile, inMovementChain, switchPlayer, becameKing));
            SceneScoreUpdater.update(this.scene, this.auxiliaryBoard.getScore(0), this.auxiliaryBoard.getScore(1));
            return true;
        }
        return false;
    }

    /**
     * Undoes the last move.
     * @returns {MyGameMove} - The move that was undone.
     */
    undoMove() {
        const move = this.gameSequence.popLastMove();
        if (move) {
            // Undo becomeKing
            if(move.becameKing) {
                move.endTile.piece.isKing = false;
            }

            // Move piece from endTile to startTile
            this.board.movePiece(move.endTile.piece, move.startTile);

            // Change current player
            if (move.switchedPlayer) {
                this.timetracker.resetRoundtime();
                this.switchPlayer();
            }

            // Replace captured tiles
            if(Math.abs(move.endTile.col - move.startTile.col) > 1) {
                const capturedPiece = this.auxiliaryBoard.popPiece(1 - this.currentPlayer); // Recover piece from opponent
                const deltaRow = Math.sign(move.endTile.row - move.startTile.row);
                const deltaCol = Math.sign(move.endTile.col - move.startTile.col);
                const tile = this.board.getTile(move.startTile.row + deltaRow, move.startTile.col + deltaCol);
                capturedPiece.tile = tile;
                tile.piece = capturedPiece;
                
                this.board.movePiece(capturedPiece, tile);
                move.capturedPiece = capturedPiece;
            }
            SceneScoreUpdater.update(this.scene, this.auxiliaryBoard.getScore(0), this.auxiliaryBoard.getScore(1));
            return move;   
        }
        return null;
    }

    /**
     * Captures a piece between two tiles.
     * @param {MyGameTile} startTile - Start tile.
     * @param {MyGameTile} endTile - End tile.
     * @returns {boolean} - True if a piece was captured, false otherwise.
     */
    capturePieceBetweenTiles(startTile, endTile) {
        const piece = this.getPieceBetweenTiles(startTile, endTile);

        if(piece != null) {
            const auxiliaryTile = this.auxiliaryBoard.getAvailableTile(piece);
            this.board.removeFromPlay(piece);
            this.board.movePiece(piece, auxiliaryTile);
            return true;
        }
        return false;
    }

    /**
     * Gets the piece between two tiles.
     * @param {MyGameTile} startTile - Start tile.
     * @param {MyGameTile} endTile - End tile.
     * @returns {MyGamePiece} - The piece between the two tiles, null if there is no piece.
     */
    getPieceBetweenTiles(startTile, endTile) {
        const deltaRow = Math.sign(endTile.row - startTile.row);
        const deltaCol = Math.sign(endTile.col - startTile.col);
        const tile = this.board.getTile(startTile.row + deltaRow, startTile.col + deltaCol);
        if(tile != endTile && tile.piece != null) {
            return tile.piece;
        }
        return null;
    }

    /**
     * Updates the game state.
     * @param {number} currTime - Current time.
     */
    update(currTime) {
        this.state.update(currTime);
    }

    /**
     * Updates the time tracker.
     * @param {number} elapsedTime - Elapsed time.
     */
    updatePlaytime(elapsedTime) {
        this.timetracker.incrementTime(this.currentPlayer, elapsedTime);
    }

    /**
     * Gets the possible capture moves for a piece.
     * @param {MyGamePiece} piece - Piece to be moved.
     * @returns {MyGameMove[]} - Array of possible capture moves.
     */
    getPossibleCapturesByPiece(piece) {
        let rowDirections = piece.isKing ? [-1, 1] : (piece.playerId == 0 ? [1] : [-1]);
        const pieceRow = piece.tile.row;
        const pieceCol = piece.tile.col;
        
        // Check if diagonal is occupied, and the following space is empty
        let possibleDestinationTiles = [];
        for (const direction of rowDirections) {
            for (const offset of [-1 , 1]) {
                let capturedTile = this.board.getTile(pieceRow+direction, pieceCol+offset);
                if (capturedTile && capturedTile.piece != null && capturedTile.piece.playerId != piece.playerId) { // There's an enemy piece in the diagonal
                    let destinationTile = this.board.getTile(pieceRow+direction*2, pieceCol+offset*2);
                    if (destinationTile && destinationTile.piece == null) { // Tile is currently empty
                        possibleDestinationTiles.push(destinationTile);
                    }
                }
            }
        }

        return possibleDestinationTiles;
    }

    /**
     * Checks if a piece has any possible capture moves.
     * @param {MyGamePiece} piece - Piece to be moved.
     * @returns {boolean} - True if the piece has any possible capture moves, false otherwise.
     */
    pieceHasCaptureAvailable(piece) {
        return this.getPossibleCapturesByPiece(piece).length > 0;
    }

    /**
     * Gets the identifier of a tile.
     * @param {MyGameTile} tile - Tile to be identified.
     * @returns {string} - Identifier of the tile.
     */
    getTileIdentifier(tile) {
        return "tile" + tile.row + "-" + tile.col;
    }

    /**
     * Gets the possible captures for the current player.
     * @returns {Object} - Object containing the possible captures for the current player.
     */
    getPossibleCaptures() {
        let possibleCaptures = {};
        
        const availablePieces = this.board.getPiecesByPlayer(this.currentPlayer);
        for (const piece of availablePieces) {
            const possiblePieceCaptures = this.getPossibleCapturesByPiece(piece);
            if (possiblePieceCaptures.length > 0) {
                possibleCaptures[this.getTileIdentifier(piece.tile)] = possiblePieceCaptures;
            }
        }
        return possibleCaptures;
    }

    /**
     * Checks if the game is over.
     * The game is over if any auxiliar board is full, the current player can not move or the time is up.
     * @returns {boolean} - True if the game is over, false otherwise.
     */
    isGameover() {
        return this.auxiliaryBoard.isFull(0) || this.auxiliaryBoard.isFull(1) || !this._canMoveAnyPiece(this.currentPlayer) || this.timetracker.isGameover();
    }

    /**
     * Migrates a game sequence.
     * @param {MyGameSequence} gameSequence - Game sequence to be migrated.
     * @returns {MyGameSequence} - Migrated game sequence.
     */
    migrateGameSequence(gameSequence) {
        for(const move of gameSequence.moves) {
            move.startTile = this.board.getTile(move.startTile.row, move.startTile.col);
            move.endTile = this.board.getTile(move.endTile.row, move.endTile.col);
        }
        return gameSequence;
    }

    /**
     * Checks if a player can move any piece.
     * @param {number} playerId - Player identifier.
     * @returns {boolean} - True if the player can move any piece, false otherwise.
     */
    _canMoveAnyPiece(playerId) {
        const availablePieces = this.board.getPiecesByPlayer(playerId);
        for (const piece of availablePieces) {
            if (this._canMovePiece(piece)) return true;
        }
        return false;
    }

    /**
     * Checks if a piece can be moved.
     * @param {MyGamePiece} piece - Piece to be moved.
     * @returns {boolean} - True if the piece can be moved, false otherwise.
     */
    _canMovePiece(piece) {
        const startTile = piece.tile;
        const rowDirections = piece.isKing ? [-1, 1] : (piece.playerId == 0 ? [1] : [-1]);
        for (const direction of rowDirections) {
            for (const offset of [-1 , 1]) {
                const targetTile = this.board.getTile(startTile.row + direction, startTile.col + offset);
                if (targetTile && targetTile.piece == null) return true;
            }
        }
        return false;
    }

    /**
     * Checks if a piece can be moved to a target tile.
     * @param {MyGamePiece} piece - Piece to be moved.
     * @param {MyGameTile} targetTile - Target tile.
     * @returns {boolean} - True if the piece can be moved to the target tile, false otherwise.
     */
    _canMovePieceToTile(piece, targetTile) {
        // Verify if the target tile is occupied
        if (targetTile.piece != null) return false;
        
        const startTile = piece.tile;
        const deltaRow = targetTile.row - startTile.row;
        const deltaCol = targetTile.col - startTile.col;
        
        // Verify movement direction, if the piece is not king
        if (!piece.isKing){
            if (piece.playerId == 0 && deltaRow <= 0) return false;
            if (piece.playerId == 1 && deltaRow >= 0) return false;
        }
        

        const possibleCaptures = this.getPossibleCapturesByPiece(piece);
        if(possibleCaptures.length > 0) {
            return possibleCaptures.includes(targetTile);
        } else {
            // Verify it moved diagonally
            if (Math.abs(deltaRow) !== Math.abs(deltaCol)) return false;

            // Verify if it moved the correct distance
            if (Math.abs(deltaRow) + Math.abs(deltaCol) !== 2) return false;
        }

        return true;
    }
}
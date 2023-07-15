import { GameState } from "./GameState.js";
import { GameAnimations } from "../GameAnimations.js";
import { AnimationTracker } from "../AnimationTracker.js";
import { AnimationState } from "./AnimationState.js";

/**
 * State that plays the movie of the game.
 */
export class MovieState extends GameState {
    /**
     * @param {StateManager} stateManager - Reference to StateManager object
     * @param {GameOrchestrator} gameOrchestrator - Reference to GameOrchestrator object
     * @param {Renderer} renderer - Reference to Renderer object
     * @param {GameSequence} gameSequence - Game sequence
     * @param {State} initialState - Initial state
     * @param {AnimationTracker} animationTracker - Reference to AnimationTracker object
     */
    constructor(stateManager, gameOrchestrator, renderer, gameSequence, initialState, animationTracker=null) {
        super(stateManager, gameOrchestrator, renderer);

        this.gameSequence = gameSequence;
        this.initialState = initialState;
        this.animationTracker = animationTracker;
    }

    update(current) {
        super.update(current);
        this.playMove();
    }

    display() {
        this.renderer.display(this.gameOrchestrator, this.timeFactor, this.animationTracker);
    }

    /**
     * Plays the next move in the game sequence.
     * If there are no more moves, returns to the initial state.
     * If there is a move, swaps to an AnimationState.
     */
    playMove() {
        const move = this.gameSequence.popFirstMove();
        if (move) {
            const capturedPiece = this.gameOrchestrator.getPieceBetweenTiles(move.startTile, move.endTile);
            const capturedPieceTile = capturedPiece ? capturedPiece.tile : null;

            this.gameOrchestrator.movePiece(move.startTile.piece, move.endTile, move.inMovementChain);
            if (move.switchedPlayer) {
                this.gameOrchestrator.switchPlayer();
            }

            let animations = new Map();
            animations.set(move.endTile.piece.id, GameAnimations.createMovementAnimation(move.startTile, move.endTile, !move.inMovementChain, move.switchedPlayer));
            if (capturedPiece) {
                animations.set(capturedPiece.id, GameAnimations.createCaptureAnimation(capturedPieceTile, capturedPiece.tile));
            }
            this.animationTracker = new AnimationTracker(animations);


            const nextState = new MovieState(this.stateManager, this.gameOrchestrator, this.renderer, this.gameSequence, this.initialState, this.animationTracker);
            this.stateManager.setState(new AnimationState(this.stateManager, this.gameOrchestrator, this.renderer, this.animationTracker, nextState));
        } else { // Return to previous state
            this.initialState.lastInstant = null;
            this.stateManager.setState(this.initialState);
        }
    }
}
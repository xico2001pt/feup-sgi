import { InteractableGameState } from './InteractableGameState.js';
import { PickingTypes } from '../PickingTypes.js';
import { LiftPieceState } from './LiftPieceState.js';
import { GameAnimations } from '../GameAnimations.js';
import { AnimationTracker } from '../AnimationTracker.js';
import { AnimationState } from './AnimationState.js';
import { DestinationSelectionState } from './DestinationSelectionState.js';
import { MovieState } from "./MovieState.js";
import { MyGameOrchestrator } from '../MyGameOrchestrator.js';
import { GameOverState } from "./GameOverState.js";

/**
 * State that handles the selection of a tile.
 * If the tile has a piece, it will be lifted.
 */
export class NextTurnState extends InteractableGameState {
    /**
     * @param {StateManager} stateManager - State manager
     * @param {GameOrchestrator} gameOrchestrator - Game CTO
     * @param {Renderer} renderer - Renderer
     */
    constructor(stateManager, gameOrchestrator, renderer) {
        super(stateManager, gameOrchestrator, renderer);
    }

    display() {
        this.renderer.display(this.gameOrchestrator, this.timeFactor);
    }

    update(current) {
        super.update(current);
        if(this.gameOrchestrator.isGameover()) {
            this.stateManager.setState(new GameOverState(this.stateManager, this.gameOrchestrator, this.renderer));
        }
    }

    handleInput(type, obj) {
        super.handleInput(type, obj);
        if (type == PickingTypes.TileSelection) {
            this.handleTilePick(obj);
        } else if (type == PickingTypes.ButtonSelection) {
            if(obj == "undo_button") {
                this.undoMove();
            }  else if (obj == "movie_button") {
                const movieGameOrchestrator = new MyGameOrchestrator(this.stateManager.scene);
                const movieGameSequence = movieGameOrchestrator.migrateGameSequence(this.gameOrchestrator.gameSequence.clone());
                this.stateManager.setState(new MovieState(this.stateManager, movieGameOrchestrator, this.renderer, movieGameSequence, this));
            }
        }
    }

    /**
     * Handles the undo of a move.
     * If the move was part of a movement chain, the state will be changed to the destination selection state.
     * Otherwise, the state will be changed to the next turn state.
     */
    undoMove() {
        const move = this.gameOrchestrator.undoMove();
        
        if(move) {
            let animations = new Map();
            animations.set(move.startTile.piece.id, GameAnimations.createMovementAnimation(move.endTile, move.startTile, true, !move.inMovementChain));
            if (move.capturedPiece) {
                const capturedPiece = move.capturedPiece;
                animations.set(capturedPiece.id, GameAnimations.createCaptureAnimation(this.gameOrchestrator.auxiliaryBoard.getAvailableTile(capturedPiece), capturedPiece.tile))
            }
            let animationTracker = new AnimationTracker(animations);
            
            if(move.inMovementChain) {
                this.gameOrchestrator.pickPiece(move.endTile.piece);
                this.stateManager.setState(new AnimationState(this.stateManager, this.gameOrchestrator, this.renderer, animationTracker, new DestinationSelectionState(this.stateManager, this.gameOrchestrator, this.renderer, move.startTile, animationTracker, false)));
            } else {
                this.stateManager.setState(new AnimationState(this.stateManager, this.gameOrchestrator, this.renderer, animationTracker, new NextTurnState(this.stateManager, this.gameOrchestrator, this.renderer)));
            }
        }
        this.gameOrchestrator.removeWarning();
    }

    /**
     * Handles the selection of a tile.
     */
    handleTilePick(obj) {
        if(obj.piece != null && this.gameOrchestrator.canPickPiece(obj.piece) && !this.gameOrchestrator.isGameover()){
            this.gameOrchestrator.pickPiece(obj.piece);
            this.gameOrchestrator.removeWarning();
            this.stateManager.setState(new LiftPieceState(this.stateManager, this.gameOrchestrator, this.renderer, obj));
        } else {
            this.gameOrchestrator.displayWarning("selection_warning_message");
        }
    }
}
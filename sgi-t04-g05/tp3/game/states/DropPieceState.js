import { InteractableGameState } from './InteractableGameState.js';
import { MyKeyframeAnimation } from "../../models/MyKeyframeAnimation.js";
import { Keyframe } from '../../models/Keyframe.js';
import { AnimationTracker } from "../AnimationTracker.js";
import { NextTurnState } from './NextTurnState.js';
import { GameAnimations } from '../GameAnimations.js';

/**
 * State that manages the dropping of a piece.
 */
export class DropPieceState extends InteractableGameState {
    /**
     * @param {StateManager} stateManager - Reference to StateManager object
     * @param {GameOrchestrator} gameOrchestrator - Reference to GameOrchestrator object
     * @param {Renderer} renderer - Reference to Renderer object
     * @param {Tile} startTile - Tile where the piece is dropped
     * @param {function} callback - Callback method called on animation end
     */
    constructor(stateManager, gameOrchestrator, renderer, startTile, callback) {
        super(stateManager, gameOrchestrator, renderer);
        this.startTile = startTile;

        let animations = new Map();
        animations.set(startTile.piece.id, GameAnimations.createLiftAnimation(true));
        this.animationTracker = new AnimationTracker(animations);

        this.callback = callback;
    }

    update(curr) {
        super.update(curr);
        if(this.animationTracker.isOver()) {
            if(this.callback) {
                this.callback();
            }
            this.stateManager.setState(new NextTurnState(this.stateManager, this.gameOrchestrator, this.renderer));
        } else {
            this.animationTracker.update(curr / 1000);
        }
    }

    display() {
        this.renderer.display(this.gameOrchestrator, this.timeFactor, this.animationTracker);
    }
}
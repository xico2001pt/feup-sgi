import { GameState } from './GameState.js';

/**
 * State that displays an animation.
 */
export class AnimationState extends GameState {
    /**
     * @param {StateManager} stateManager - Reference to StateManager object
     * @param {GameOrchestrator} gameOrchestrator - Reference to GameOrchestrator object
     * @param {Renderer} renderer - Reference to Renderer object
     * @param {AnimationTracker} animationTracker - Reference to AnimationTracker object
     * @param {State} nextState - Next state
     * @param {function} callback - Callback method called on animation end
     */
    constructor(stateManager, gameOrchestrator, renderer, animationTracker, nextState, callback=null) {
        super(stateManager, gameOrchestrator, renderer);
        this.animationTracker = animationTracker;
        this.nextState = nextState;
        this.callback = callback;
    }

    update(curr) {
        super.update(curr);
        if(this.animationTracker.isOver()) {
            if(this.callback) {
                this.callback();
            }
            this.stateManager.setState(this.nextState);
        } else {
            this.animationTracker.update(curr / 1000);
        }
    }

    display() {
        this.renderer.display(this.gameOrchestrator, this.timeFactor, this.animationTracker);
    }
}
import { MyGameOrchestrator } from "../MyGameOrchestrator.js";
import { MovieState } from "./MovieState.js";
import { InteractableGameState } from "./InteractableGameState.js";
import { PickingTypes } from "../PickingTypes.js";

/**
 * State that handles the game over screen.
 */
export class GameOverState extends InteractableGameState {
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

    handleInput(type, obj) {
        super.handleInput(type, obj);
        if (type == PickingTypes.ButtonSelection) {
            if (obj == "movie_button") {
                const movieGameOrchestrator = new MyGameOrchestrator(this.stateManager.scene);
                const movieGameSequence = movieGameOrchestrator.migrateGameSequence(this.gameOrchestrator.gameSequence.clone());
                this.stateManager.setState(new MovieState(this.stateManager, movieGameOrchestrator, this.renderer, movieGameSequence, this));
            }
        }
    }

    update(current) {}
}
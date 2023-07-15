import { GameState } from "./GameState.js";
import { PickingTypes } from "../PickingTypes.js";
import { MenuLoadingState } from "./MenuLoadingState.js";
import { MySceneGraph } from "../../MySceneGraph.js";
import { SceneTimerUpdater } from "../../rendering/SceneTimerUpdater.js";

/**
 * State that has interaction with the game.
 */
export class InteractableGameState extends GameState {
    /**
     * @param {StateManager} stateManager - Reference to StateManager object
     * @param {GameOrchestrator} gameOrchestrator - Reference to GameOrchestrator object
     * @param {Renderer} renderer - Reference to Renderer object
     */
    constructor(stateManager, gameOrchestrator, renderer) {
        super(stateManager, gameOrchestrator, renderer);
    }

    handleInput(type, obj) {
        super.handleInput(type, obj);
        if (type == PickingTypes.ButtonSelection) {
            if (obj == "return_to_menu_button") {
                this.returnToMenu();
            } else if (obj == "destination_warning_message" || obj == "selection_warning_message") {
                this.gameOrchestrator.removeWarning();
            }
        }
    }

    update(instant) {
        super.update(instant);
        if(this.lastInstant == null) {
            this.lastInstant = instant;
        } else {
            const elapsedTime = instant - this.lastInstant;
            this.gameOrchestrator.updatePlaytime(elapsedTime);
            this.lastInstant = instant;
            SceneTimerUpdater.update(this.stateManager.scene, this.gameOrchestrator.timetracker, this.gameOrchestrator.currentPlayer);
        }
    }

    /**
     * Returns to the menu.
     */
    returnToMenu() {
        this.stateManager.scene.initScene();
        new MySceneGraph("menu.xml", this.stateManager.scene);
        this.stateManager.setState(new MenuLoadingState(this.stateManager));
    }
}
import { State } from './State.js';
import { NextTurnState } from './NextTurnState.js';
import { MyGameOrchestrator } from '../MyGameOrchestrator.js';
import {GameRenderer} from "../../rendering/GameRenderer.js";

/**
 * State that handles the loading screen.
 */
export class LoadingSceneState extends State {
    /**
     * @param {StateManager} stateManager - State manager
     */
    constructor(stateManager) {
        super(stateManager);
    }

    update(current) {
        if(this.stateManager.scene.sceneInited) {
            let gameOrchestrator = new MyGameOrchestrator(this.stateManager.scene);
            let renderer = new GameRenderer(this.stateManager.scene);
            this.stateManager.setState(new NextTurnState(this.stateManager, gameOrchestrator, renderer));
        }
    }
}
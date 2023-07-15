import { State } from './State.js';
import { MenuState } from './MenuState.js';

/**
 * State that handles the menu loading.
 */
export class MenuLoadingState extends State {
    /**
     * @param {StateManager} stateManager - State manager
     */
    constructor(stateManager) {
        super(stateManager);
    }

    update(current) {
        if(this.stateManager.scene.sceneInited) {
            this.stateManager.setState(new MenuState(this.stateManager));
        }
    }
}
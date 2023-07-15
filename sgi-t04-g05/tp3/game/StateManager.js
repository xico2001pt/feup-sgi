import { MenuLoadingState } from "./states/MenuLoadingState.js";

/**
 * Class that manages the game states
 */
export class StateManager {
    /**
     * @param {MyScene} scene - MyScene object.
     */
    constructor(scene) {
        this.scene = scene;
        this.state = new MenuLoadingState(this);
    }

    /**
     * Sets the current state.
     * @param {State} state - State to be set.
     */
    setState(state) {
        this.state = state;
    }

    /**
     * Updates the current state.
     * @param {number} current - Current time.
     */
    update(current) {
        this.state.update(current);
    }

    /**
     * Displays the current state.
     */
    display() {
        this.state.display();
    }

    /**
     * Handles the input of the current state.
     * @param {number} type - Type of input.
     * @param {Object} obj - Object that triggered the input.
     */
    handleInput(type, obj) {
        this.state.handleInput(type, obj);
    }
}
/**
 * Abstract class for a state.
 */
export class State {
    /**
     * @param {StateManager} stateManager - Reference to StateManager object
     */
    constructor(stateManager) {
        this.stateManager = stateManager;
    }
    
    /**
     * Handles input
     */
    handleInput(type, obj) {}

    /**
     * Updates the state
     */
    update() {}

    /**
     * Displays the state
     */
    display() {}
}
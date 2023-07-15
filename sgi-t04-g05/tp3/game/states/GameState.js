import { State } from "./State.js";
import { PickingTypes } from "../PickingTypes.js";

/**
 * Abstract class for a game state.
 */
export class GameState extends State {
    /**
     * @param {StateManager} stateManager - Reference to StateManager object
     * @param {GameOrchestrator} gameOrchestrator - Reference to GameOrchestrator object
     * @param {Renderer} renderer - Reference to Renderer object
     */
    constructor(stateManager, gameOrchestrator, renderer) {
        super(stateManager);
        this.gameOrchestrator = gameOrchestrator;
        this.renderer = renderer;
        this.timeFactor = 0;
    }

    update(current) {
        this.timeFactor = (current / 500) % 5000 * Math.PI;
        this.timeFactor = (Math.sin(this.timeFactor) + 1.0) / 2.0;
    }

    handleInput(type, obj) {
        if (type == PickingTypes.ButtonSelection) {
            if (obj == "prev_camera_button") {
                this.setPrevCamera();
            } else if (obj == "next_camera_button") {
                this.setNextCamera();
            }
        }
    }

    mod(n, m) { // JS % doesn't work properly with negative numbers
        return ((n % m) + m) % m;
    }

    setNextCamera() {
        const scene = this.gameOrchestrator.scene;
        const camerasIds = scene.camerasIds;
        const index = camerasIds.indexOf(scene.cameraId);
        const nextIndex = this.mod(index+1, camerasIds.length);
        scene.setTargetCamera(camerasIds[nextIndex]);
        
    }

    setPrevCamera() {
        const scene = this.gameOrchestrator.scene;
        const camerasIds = scene.camerasIds;
        const index = camerasIds.indexOf(scene.cameraId);
        const nextIndex = this.mod(index - 1, camerasIds.length);
        scene.setTargetCamera(camerasIds[nextIndex]);
    }
}

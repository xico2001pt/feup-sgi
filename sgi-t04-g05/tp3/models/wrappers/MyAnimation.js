/**
 * Abstract model for animations
 */
export class MyAnimation {
    /**
     * Updates the animation
     * @param {number} instant - Current instant
     */
    update(instant) {
        throw new Error("Method not implemented.");
    }

    /**
     * Applies the transformation matrix to the given scene
     * @param {CGFscene} scene - Scene to apply the transformation matrix
     */
    apply(scene) {
        throw new Error("Method not implemented.");
    }
}
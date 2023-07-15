/**
 * Class that tracks the animations of the game.
 */
export class AnimationTracker {
    /**
     * @param {Map} animations - Map of animations.
     */
    constructor(animations) {
        this.animations = animations;
    }

    /**
     * Checks if all animations are over.
     * @returns {boolean} - True if all animations are over, false otherwise.
     */
    isOver() {
        for(const animation of this.animations.values()) {
            if(!animation.isOver()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Updates all animations.
     * @param {number} curr - Current time.
     */
    update(curr) {
        for(const animation of this.animations.values()) {
            animation.update(curr);
        }
    }

    /**
     * Gets the animation with the given index.
     * @param {number} index - Index of the animation.
     * @returns {Animation} - Animation with the given index.
     */
    getAnimation(index) {
        return this.animations.get(index);
    }
}
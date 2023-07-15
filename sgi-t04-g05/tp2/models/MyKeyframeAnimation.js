import { MyAnimation } from "./wrappers/MyAnimation.js";

/**
 * Class that represents a keyframe animation
 */
export class MyKeyframeAnimation extends MyAnimation {
    /**
     * @param {string} id - Id of the animation
     * @param {*} keyframes - Keyframes of the animation
     */
    constructor(id, keyframes) {
        super();
        this.id = id;
        this.keyframes = keyframes;
        this.transformation = {};
        this.started = false;
    }

    getId() {
        return this.id;
    }

    getKeyframes() {
        return this.keyframes;
    }

    update(instant) {
        let lastKeyframeIndex = this.getLastKeyframeIndex(instant);
        
        if(lastKeyframeIndex == null) return;

        if (lastKeyframeIndex < this.keyframes.length - 1) { // Animation is running
            const nextKeyframeIndex = lastKeyframeIndex + 1;
            // Interpolate between lastKeyframeIndex and nextKeyframeIndex
            const lastKeyframe = this.keyframes[lastKeyframeIndex];
            const nextKeyframe = this.keyframes[nextKeyframeIndex];
            const lastInstant = lastKeyframe.instant;
            const nextInstant = nextKeyframe.instant;
            const keyframeDuration = nextInstant - lastInstant;
            const deltaInstant = instant - lastInstant;

            for(const [name, lastPosition] of Object.entries(lastKeyframe.transformation)) {
                const nextPosition = nextKeyframe.transformation[name];
                let output = vec3.fromValues(0, 0, 0);
                vec3.lerp(output, lastPosition, nextPosition, deltaInstant / keyframeDuration);
                this.transformation[name] = output;
            }
        } else { // Animation is finished
            this.transformation = this.keyframes[lastKeyframeIndex].transformation;
        }
    }

    /**
     * Gets the index of the last keyframe that has an instant lower than the given instant
     * @param {number} instant - Instant to compare
     * @returns {number} Index of the last keyframe that has an instant lower than the given instant
     */
    getLastKeyframeIndex(instant) {
        for(let i = this.keyframes.length - 1; i >= 0; --i) {
            if(this.keyframes[i].instant <= instant){
                this.started = true;
                return i;
            }
        }
        return null;
    }

    apply(scene) {
        if(this.started){
            scene.translate(...this.transformation["translation"]);
            scene.rotate(this.transformation["rotationx"][0], 1, 0, 0);
            scene.rotate(this.transformation["rotationy"][0], 0, 1, 0);
            scene.rotate(this.transformation["rotationz"][0], 0, 0, 1);
            scene.scale(...this.transformation["scale"]);
        }
    }
}
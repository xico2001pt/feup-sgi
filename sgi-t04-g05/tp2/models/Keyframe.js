/**
 * Class that represents a keyframe
 */
export class Keyframe {
    /**
     * @param {number} instant - Instant of the keyframe
     * @param {*} transformation - Transformation matrix of the keyframe
     */
    constructor(instant, transformation) {
        this.instant = instant;
        this.transformation = transformation;
    }
}
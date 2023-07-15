/**
 * Model that represents a rotation
 */
export class Rotation {
    /**
     * @param {string} axis - Axis of the rotation
     * @param {number} angle - Angle of the rotation in degrees
     */
    constructor(axis, angle){
        this.axis = axis;
        let DEGREE_TO_RAD = Math.PI / 180;
        this.angle = angle * DEGREE_TO_RAD;
    }

    /**
     * Gets the axis array representation
     * @returns Axis array representation
     */
    getAxisArray(){
        switch (this.axis) {
            case 'x': return [1, 0, 0];
            case 'y': return [0, 1, 0];
            case 'z': return [0, 0, 1];
        }
        return [0, 0, 0];
    }

    /**
     * Gets the angle of the rotation in degrees
     * @returns Angle of the rotation in radians
     */
    getAngle() {
        return this.angle;
    }
}
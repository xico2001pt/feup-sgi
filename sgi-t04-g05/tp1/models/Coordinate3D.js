/**
 * Model representing a 3D coordinate
 */
export class Coordinate3D {
    /**
     * @param {float} x - x coordinate
     * @param {float} y - y coordinate
     * @param {float} z - z coordinate
     */
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Gets the coordinate components in a [x, y, z] array
     * @returns {Array<float>} - Coordinate components
     */
    getArray() {
        return [this.x, this.y, this.z];
    }
}
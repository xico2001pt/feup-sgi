/**
 * Model that represents a transformation
 */
export class MyTransformation {
    /**
     * @param {string} id - Id of the transformation
     * @param {mat4} mat - Matrix that represents the transformation
     */
    constructor(id, mat=mat4.create()) {
        this.id = id;
        this.mat = mat;
    }

    /**
     * Gets the id of the transformation
     * @returns Id of the transformation
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the matrix of the transformation
     * @returns Matrix of the transformation
     */
    getMat() {
        return this.mat;
    }
}
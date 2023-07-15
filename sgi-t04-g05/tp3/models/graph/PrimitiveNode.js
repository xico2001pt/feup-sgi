/**
 * Model that represents a primitive node
 */
export class PrimitiveNode {
    /**
     * @param {string} id - id of the node
     * @param {CGFobject} CGFObject - Reference to the CGFobject
     */
    constructor(id, CGFObject) {
        this.id = id;
        this.object = CGFObject;
    }

    /**
     * Gets the id of the node
     * @returns id of the node
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the CGFobject reference
     * @returns CGFobject reference
     */
    getObject() {
        return this.object;
    }
}
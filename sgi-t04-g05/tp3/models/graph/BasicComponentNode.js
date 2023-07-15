export class BasicComponentNode {
    constructor(id, offsetTransformation, primitives) {
        this.id = id;
        this.transformation = offsetTransformation;
        this.primitives = primitives;
    }

    /**
     * Get the id of the component
     * @returns {string} - Id of the component
     */
    getId() {
        return this.id;
    }

    /**
     * Get list of child component nodes
     * @returns {Array<MyComponentNode>} - List of the children components
     */
    getChildComponents() {
        return [];
    }

    /**
     * Get list of child primitive nodes
     * @returns {Array<MyPrimitiveNode>} - List of the children primitives
     */
     getChildPrimitives() {
        return this.primitives;
    }

    /**
     * Get the transformation object
     * @returns {MyTransformation} transformation - Transformation object
     */
    getTransformation() {
        return this.transformation;
    }

    getHighlight() {
        return null;
    }

    getAnimation() { 
        return null;
    }

    /**
     * Get the current material object
     * @returns {MyMaterial|string} - Current material object or "inherit"
     */
    getMaterial() {
        return "inherit";
    }

    /**
     * Get the texture object
     * @returns {MyTexture|string} - Texture object or "inherit" or "none"
     */
    getTexture() {
        return "none";
    }

    /**
     * Update current material to the next one on the materials list
     */
    updateMaterial() {
    }
}

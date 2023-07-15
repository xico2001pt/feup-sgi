 export class PickableComponentNode {
    constructor(id, component, pickingId, pickingObject) {
        this.id = id;
        this.component = component;
        this.pickingId = pickingId;
        this.pickingObject = pickingObject;
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
        return this.component.getChildComponents();
    }

    /**
     * Get list of child primitive nodes
     * @returns {Array<MyPrimitiveNode>} - List of the children primitives
     */
     getChildPrimitives() {
        return this.component.getChildPrimitives();
    }

    /**
     * Get the transformation object
     * @returns {MyTransformation} transformation - Transformation object
     */
    getTransformation() {
        return this.component.getTransformation();
    }

    getHighlight() {
        return this.component.getHighlight();
    }

    getAnimation() {
        return this.component.getAnimation();
    }

    /**
     * Get the current material object
     * @returns {MyMaterial|string} - Current material object or "inherit"
     */
    getMaterial() {
        return this.component.getMaterial();
    }

    /**
     * Get the texture object
     * @returns {MyTexture|string} - Texture object or "inherit" or "none"
     */
    getTexture() {
        return this.component.getTexture();
    }

    /**
     * Update current material to the next one on the materials list
     */
    updateMaterial() {
        this.component.updateMaterial();
    }
}

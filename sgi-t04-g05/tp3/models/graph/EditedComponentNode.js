export class EditedComponentNode {
    constructor(id, component, offsetTransformation, primitives, animation=null, highlight=null) {
        this.id = id;
        this.component = component;
        this.transformation = offsetTransformation;
        this.highlight = highlight==null ? this.component.highlight : highlight;
        this.animation = animation==null ? this.component.animation : animation;
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
        return [this.component];
    }

    /**
     * Get list of child primitive nodes
     * @returns {Array<MyPrimitiveNode>} - List of the children primitives
     */
     getChildPrimitives() {
        return [];
    }

    /**
     * Get the transformation object
     * @returns {MyTransformation} transformation - Transformation object
     */
    getTransformation() {
        return this.transformation;
    }

    getHighlight() {
        return this.highlight;
    }

    getAnimation() { 
        return this.animation;
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

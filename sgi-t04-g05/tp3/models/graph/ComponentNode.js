/**
 * Component Node representation, contains data from <component>
 */
 export class ComponentNode {
    /**
    * @param {string} id - Node id
    * @param {MyTransformation} transformation - Id of the transformation used
    * @param {Array<MyMaterial>} materials - List of the materials used, can be MyMaterial or "inherit"
    * @param {MyTexture|string} texture - Texture used, can be "inherit", "none" or a MyTexture object
    * @param {Array<string>} childComponentsId - Ids of all the children components
    * @param {Array<string>} childPrimitivesId - Ids of all the children primitives
    * @param {Highlight} highlight - Highlight object
    * @param {Animation} animation - Animation object
    */
    constructor(id, transformation, materials, texture, childComponentsId, childPrimitivesId, highlight=null, animation=null) {
        this.id = id;
        this.transformation = transformation;
        this.materials = materials;
        this.currentMaterial = 0;
        this.texture = texture;
        this.childComponentsId = childComponentsId;
        this.childPrimitivesId = childPrimitivesId;
        this.highlight = highlight;
        this.animation = animation;
    }

    /**
     * Get the id of the component
     * @returns {string} - Id of the component
     */
    getId() {
        return this.id;
    }

    /**
     * Set the component's children, components or primitives
     * @param {MyComponentNode} children - Array of child components
     * @param {MyPrimitiveNode} primitives - Array of child primitives
     */
    setChildren(components, primitives) {
        this.components = components;
        this.primitives = primitives;
    }

    /**
     * Get list of child component nodes
     * @returns {Array<MyComponentNode>} - List of the children components
     */
    getChildComponents() {
        return this.components;
    }

    /**
     * Get list of child primitive nodes
     * @returns {Array<MyPrimitiveNode>} - List of the children primitives
     */
     getChildPrimitives() {
        return this.primitives;
    }

    getHighlight() {
        return this.highlight;
    }

    getAnimation() {
        return this.animation;
    }

    /**
     * Get the transformation object
     * @returns {MyTransformation} transformation - Transformation object
     */
    getTransformation() {
        return this.transformation;
    }

    /**
     * Get the current material object
     * @returns {MyMaterial|string} - Current material object or "inherit"
     */
    getMaterial() {
        return this.materials[this.currentMaterial];
    }

    /**
     * Get the texture object
     * @returns {MyTexture|string} - Texture object or "inherit" or "none"
     */
    getTexture() {
        return this.texture;
    }

    /**
     * Update current material to the next one on the materials list
     */
    updateMaterial() {
        this.currentMaterial = (this.currentMaterial + 1) % this.materials.length;
    }
}

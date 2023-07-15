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
    */
    constructor(id, transformation, materials, texture, childComponentsId, childPrimitivesId) {
        this.id = id;
        this.transformation = transformation;
        this.materials = materials;
        this.currentMaterial = 0;
        this.texture = texture;
        this.childComponentsId = childComponentsId;
        this.childPrimitivesId = childPrimitivesId;
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
     * @param {MyComponentNode|MyPrimitiveNode} children - Array of child nodes
     */
    setChildren(children) {
        this.children = children;
    }

    /**
     * Get list of child nodes
     * @returns {Array<MyComponentNode|MyPrimitiveNode>} - List of the children
     */
    getChildren() {
        return this.children;
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

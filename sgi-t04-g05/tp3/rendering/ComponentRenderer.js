import {PrimitiveNode} from "../models/graph/PrimitiveNode.js";

/**
 * Class responsible for rendering a SceneData
 */
export class ComponentRenderer {
    /**
     * @param {SceneData} sceneData - Reference to the SceneData
     */
    constructor(sceneData) {
        this.sceneData = sceneData;
    }

    display(timeFactor, node) {
        this.displayComponent(node, null, null, timeFactor);
    }

    /**
     * Auxiliar method to display a PrimitiveNode
     * @param {PrimitiveNode} node - Reference to the PrimitiveNode
     * @param {MyTexture} texture - Reference to the parent's texture
     */
    displayPrimitive(node, texture) {
        const obj = node.getObject();
        if(texture !== "inherit" && texture !== "none"){
            obj.updateTexLength(texture.getLength_s(), texture.getLength_t());
        }
        node.getObject().display();
    }

    /**
     * Auxiliar method to display a ComponentNode
     * @param {ComponentNode} node - Reference to the ComponentNode
     * @param {MyMaterial} parentMaterial - Reference to the parent's material
     * @param {MyTexture} parentTexture - Reference to the parent's texture
     */
    displayComponent(node, parentMaterial, parentTexture, timeFactor) {
        if(node.animation != null && !node.animation.started){
            return false;
        }

        const matrix = node.getTransformation() != null ? node.getTransformation() : mat4.create();
        const scene = this.sceneData.scene;

        let material = node.getMaterial();
        if(material === "inherit") {
            material = parentMaterial;
        }

        material.getCGFAppearance().apply();


        let texture = node.getTexture();
        const gl = this.sceneData.scene.gl;
        if(texture === "inherit") {
            texture = parentTexture;
        }
        if(texture !== "none") {
            if(texture.getCGFTexture().bind(0)){
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl["REPEAT"]);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl["REPEAT"]);
            }
        }

        scene.pushMatrix();
        scene.multMatrix(matrix);

        if(node.animation != null) {
            node.animation.apply(scene);
        }

        for(const child of node.getChildComponents()){
            this.displayComponent(child, material, texture, timeFactor);
        }
        for(const child of node.getChildPrimitives()){
            this.displayPrimitive(child, texture);
        }

        const hasTexture = texture !== "none";

        if(texture !== "none") {
            texture.getCGFTexture().unbind(0);
        }
        if(parentTexture !== null && parentTexture !== "none") {
            parentTexture.getCGFTexture().bind(0);
        }
        scene.popMatrix();
        
        if(material != parentMaterial && parentMaterial != null) {
            parentMaterial.getCGFAppearance().apply();
        }
    }
}
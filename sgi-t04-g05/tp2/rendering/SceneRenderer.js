import {PrimitiveNode} from "../models/graph/PrimitiveNode.js";

/**
 * Class responsible for rendering a SceneData
 */
export class SceneRenderer {
    /**
     * @param {SceneData} sceneData - Reference to the SceneData
     */
    constructor(sceneData) {
        this.sceneData = sceneData;
        this.activeShader = "default";
        this.hasAnyHighlight = false;
    }

    /**
     * Displays the given node.
     * Should be called every frame.
     * @param {*} node - Reference to the PrimitiveNode or ComponentNode
     * @param {MyMaterial} parentMaterial - Reference to the parent's material
     * @param {MyTexture} parentTexture - Reference to the parent's texture
     */
    display(timeFactor, node=this.sceneData.components[this.sceneData.root], parentMaterial=null, parentTexture=null) {
        if(this.activeShader === "default"){
            this.hasAnyHighlight = this.displayComponent(node, parentMaterial, parentTexture, timeFactor, false);
            if(this.hasAnyHighlight){
                this.sceneData.scene.setActiveShader(this.sceneData.highlightShader);
                this.displayComponent(node, parentMaterial, parentTexture, timeFactor, true, true);
            }
            this.activeShader = "highlight";
        } else {
            if(this.hasAnyHighlight){
                this.displayComponent(node, parentMaterial, parentTexture, timeFactor, true, true);
            }
            this.hasAnyHighlight = this.sceneData.scene.setActiveShaderSimple(this.sceneData.scene.defaultShader);
            this.displayComponent(node, parentMaterial, parentTexture, timeFactor, false);
            this.activeShader = "default";
        }
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
    displayComponent(node, parentMaterial, parentTexture, timeFactor, highlightMode=false) {
        if(node.animation != null && !node.animation.started){
            return false;
        }

        if(highlightMode == true && !node.hasHighlight){
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

        const highlight = node.highlight;
        const hasHighlight = highlight != null && highlight.active;
        node.hasHighlight = hasHighlight;

        for(const child of node.getChildComponents()){
            node.hasHighlight = this.displayComponent(child, material, texture, timeFactor, highlightMode) || node.hasHighlight;
        }

        const hasTexture = texture !== "none";

        if(hasHighlight && highlightMode) {
            this.sceneData.highlightShader.setUniformsValues({'scale': highlight.scale_h, 'timeFactor': timeFactor, 'targetColor': highlight.color.getArray(), 'hasTexture': hasTexture});
        }
        if(hasHighlight == highlightMode) {
            for(const child of node.getChildPrimitives()){
                this.displayPrimitive(child, texture);
            }
        }

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
        
        return node.hasHighlight;
    }
}
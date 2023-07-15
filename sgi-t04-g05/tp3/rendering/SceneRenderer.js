import {PrimitiveNode} from "../models/graph/PrimitiveNode.js";
import { MyRectangle } from "../primitives/MyRectangle.js";

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
     * @param {ComponentNode} node - Reference to ComponentNode
     * @param {Number} timeFactor - Time factor
     * @param {ComponentNode} viewIndependentComponent - Node that should be rendered independently from camera view

     */
    display(timeFactor, viewIndependentComponent=null, node=this.sceneData.components[this.sceneData.root]) {
        if(this.sceneData.scene.pickMode) {
            this.displayComponent(node, null, null, timeFactor, false);
            this.displayComponent(node, null, null, timeFactor, true);
            this.displayViewIndependentComponent(viewIndependentComponent, timeFactor);
        } else {
            if(this.activeShader === "default"){
                this.hasAnyHighlight = this.displayComponent(node, null, null, timeFactor, false);
                this.displayViewIndependentComponent(viewIndependentComponent);
                if(this.hasAnyHighlight){
                    this.sceneData.scene.setActiveShader(this.sceneData.highlightShader);
                    this.displayComponent(node, null, null, timeFactor, true);
                }
                this.activeShader = "highlight";
            } else {
                if(this.hasAnyHighlight){
                    this.displayComponent(node, null, null, timeFactor, true);
                }
                this.sceneData.scene.setActiveShader(this.sceneData.scene.defaultShader);
                this.displayComponent(node, null, null, timeFactor, false);
                this.displayViewIndependentComponent(viewIndependentComponent);
                this.activeShader = "default";
            }
        }
    }

    /**
     * Display an component independently from the camera view
     * @param {ComponentNode} node - Reference to the ComponentNode
     * @param {Number} timeFactor - Time factor
     */
    displayViewIndependentComponent(node, timeFactor) {
        if(node) {
            const scene = this.sceneData.scene;
            scene.gl.disable(scene.gl.DEPTH_TEST);
            scene.pushMatrix();
            scene.loadIdentity();
            scene.translate(45,0,-50);
            this.displayComponent(node, null, null, timeFactor, false);
            scene.popMatrix();
            scene.gl.enable(scene.gl.DEPTH_TEST);
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
        if(node.getAnimation() != null && !(node.getAnimation().started || node.getAnimation().immediateStart)){
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

        if(node.getAnimation() != null) {
            node.getAnimation().apply(scene);
        }

        const highlight = node.getHighlight();
        const hasHighlight = highlight != null && highlight.active;
        node.hasHighlight = hasHighlight;

        if(node.pickingId != null) {
            this.sceneData.scene.registerForPick(node.pickingId, node.pickingObject);
        }

        for(const child of node.getChildComponents()){
            node.hasHighlight = this.displayComponent(child, material, texture, timeFactor, highlightMode) || node.hasHighlight;
        }

        const hasTexture = texture !== "none";

        if(hasHighlight && highlightMode && !this.sceneData.scene.pickMode) {
            this.sceneData.highlightShader.setUniformsValues({'scale': highlight.scale_h, 'timeFactor': timeFactor, 'targetColor': highlight.color.getArray(), 'hasTexture': hasTexture});
        }
        if(hasHighlight == highlightMode) {
            for(const child of node.getChildPrimitives()){
                this.displayPrimitive(child, texture);
            }
        }

        if(node.pickingId != null) {
            this.sceneData.scene.clearPickRegistration();
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
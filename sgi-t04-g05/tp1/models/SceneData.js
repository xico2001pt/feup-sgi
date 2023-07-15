/**
 * Model that contains information about a scene
 */
export class SceneData {
    /**
     * @param {CGFscene} scene - Reference to the CGFscene
     */
    constructor(scene) {
        // Global values
        this.scene = scene;
        this.root = null;
        this.referenceLength = 1;
        this.ambient = [];
        this.background = [];

        // Active (default) values
        this.defaultView = "";

        // Lists of elements
        this.views = {};
        this.lights = {};
        this.textures = {};
        this.materials = {};
        this.transformations = {};
        this.primitives = {};
        this.components = {}
    }
}
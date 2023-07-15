/**
 * Updates the material of all the components in the scene.
 */
export class MaterialUpdater {
    /**
     * @param {CGFscene} scene - Reference to MyScene object
     */
    constructor(sceneData) { 
        this.sceneData = sceneData;
    }

    /**
     * Updates the material of all the components in the scene.
     */
    update() {
        for (const component of Object.values(this.sceneData.components)) {
            component.updateMaterial();
        }
    }
}
import { CGFappearance } from "../../../lib/CGF.js";

/**
 * Model that represents a material
 */
export class MyMaterial {
    /**
     * @param {string} id - Material id
     * @param {CGFAppearance} CGFAppearance - CGFappearance object
     */
    constructor(id, CGFAppearance){
        this.id = id;
        this.CGFAppearance = CGFAppearance;
    }

    /**
     * Instantiate a material with the given parameters
     * @param {string} id - Material id
     * @param {Color} ambient - Ambient component
     * @param {Color} diffuse - Diffuse component
     * @param {Color} specular - Specular component
     * @param {Color} emission - Emission component
     * @param {int} shininess - Shininess of the material
     * @param {CGFScene} scene - Scene
     * @returns 
     */
    static instantiate(id, ambient, diffuse, specular, emission, shininess, scene) {
        let CGFAppearance = new CGFappearance(scene);

        CGFAppearance.setAmbient(...ambient.getArray());
        CGFAppearance.setDiffuse(...diffuse.getArray());
        CGFAppearance.setSpecular(...specular.getArray());
        CGFAppearance.setEmission(...emission.getArray());
        CGFAppearance.setShininess(shininess);

        return new MyMaterial(id, CGFAppearance);
    }

    /**
     * Gets the id of the material
     * @returns {string} - Id of the material
     */
    getId() {
        return this.id;
    }

    /** 
     * Gets the CGFappearance object
     * @returns {CGFappearance} - CGFappearance object
    */
    getCGFAppearance(){
        return this.CGFAppearance;
    }

    /**
     * Gets the emission component of the material
     * @returns {vec3} - Emission component
     */
    getEmission(){
        return this.CGFAppearance.emission;
    }

    /**
     * Gets the ambient component of the material
     * @returns {vec3} - Ambient component
     */
    getAmbient(){
        return this.CGFAppearance.ambient;
    }

    /**
     * Gets the diffuse component of the material
     * @returns {vec3} - Diffuse component
     */
    getDiffuse(){
        return this.CGFAppearance.diffuse;
    }

    /**
     * Gets the specular component of the material
     * @returns {vec3} - Specular component
     */
    getSpecular(){
        return this.CGFAppearance.specular;
    }

    /**
     * Gets the shininess of the material
     * @returns {int} - Shininess of the material
     */
    getShininess(){
        return this.CGFAppearance.shininess;
    }
}
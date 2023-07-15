import { CGFtexture } from "../../../lib/CGF.js";

/**
 * Model that represents a texture
 */
export class MyTexture {
    /**
     * @param {string} id - Id of the texture
     * @param {CGFtexture} CGFTexture - Reference to the CGFtexture
     * @param {number} length_s - Horizontal texture scale factor
     * @param {number} length_t - Vertical texture scale factor
     */
    constructor(id, CGFTexture, length_s, length_t) {
        this.id = id;
        this.CGFTexture = CGFTexture;
        this.length_s = length_s;
        this.length_t = length_t
    }

    /**
     * Instantiates a MyTexture class with the given parameters
     * @param {*} id - Id of the texture
     * @param {number} length_s - Horizontal texture scale factor
     * @param {number} length_t - Vertical texture scale factor
     * @param {CGFscene} scene - Reference to the CGFscene
     * @param {string} fileURL - Texture file URL
     * @returns 
     */
    static instantiate(id, length_s, length_t, scene, fileURL) {
        let CGFTexture = new CGFtexture(scene, fileURL)
        return new MyTexture(id, CGFTexture, length_s, length_t);
    }

    /**
     * Gets the id of the texture
     * @returns Id of the texture
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the reference to the CGFtexture
     * @returns Reference to the CGFtexture
     */
    getCGFTexture() {
        return this.CGFTexture;
    }

    /**
     * Gets the horizontal texture scale factor
     * @returns Horizontal texture scale factor
     */
    getLength_s() {
        return this.length_s;
    }

    /**
     * Gets the vertical texture scale factor
     * @returns Vertical texture scale factor
     */
    getLength_t() {
        return this.length_t;
    }
}
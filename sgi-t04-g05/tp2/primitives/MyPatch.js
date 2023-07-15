import { CGFobject, CGFnurbsSurface, CGFnurbsObject } from "../../lib/CGF.js";

export class MyPatch extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {Number} degree_u - Degree in U
     * @param  {Number} degree_v - Degree in V
     * @param  {Number} parts_u - Number of parts in U
     * @param  {Number} parts_v - Number of parts in V
     * @param  {Array} controlpoints - Array of control points
     */
    constructor(scene, degree_u, degree_v, controlpoints, parts_u, parts_v) {
        super(scene);
        let surface = new CGFnurbsSurface(degree_u, degree_v, controlpoints);
        this.obj = new CGFnurbsObject(scene, parts_u, parts_v, surface );
    }

    /**
	 * Updates the texture coordinates of the primitive according to the given lengths.
	 * @param {float} length_u - Horizontal length of the texture
	 * @param {float} length_v - Vertical length of the texture
	 */
	updateTexLength(length_u, length_v) {
        // Not implemented
	}

    /**
     * Displays the primitive
     */
    display() {
        this.obj.display();
    }
}
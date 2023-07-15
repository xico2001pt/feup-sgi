import { CGFobject } from '../../lib/CGF.js';
/**
 * MyRectangle
 */
export class MyRectangle extends CGFobject {
	/**
	 * @param {CGFScene} scene - Reference to MyScene object
	 * @param {float} x1 - x coordinate of the first point
	 * @param {float} x2 - x coordinate of the second point
	 * @param {float} y1 - y coordinate of the first point
	 * @param {float} y2 - y coordinate of the second point
	 */
	constructor(scene, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}
	
	/**
	 * Initializes the buffers of the primitive
	 */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	/**
	 * Updates the texture coordinates of the rectangle according to the given lengths.
	 * @param {float} length_u - Horizontal length of the texture
	 * @param {float} length_v - Vertical length of the texture
	 */
	 updateTexLength(length_u, length_v) {
		let u = 1 / length_u / (this.x2-this.x1);
		let v = 1 / length_v / (this.y2-this.y1);
		let coords = [
			0, v,
			u, v,
			0, 0,
			u, 0
		];
		this.updateTexCoords(coords);
	}
}


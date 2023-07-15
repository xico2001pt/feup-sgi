import { CGFobject } from '../../lib/CGF.js';

/**
 * Triangle primitive
 */
export class MyTriangle extends CGFobject {
	/**
	 * @param {CGFscene} scene - Reference to CGFscene
	 * @param {number} x1 - x coordinate of the first position 
	 * @param {number} x2 - x coordinate of the second position 
	 * @param {number} x3 - x coordinate of the third position 
	 * @param {number} y1 - y coordinate of the first position 
	 * @param {number} y2 - y coordinate of the second position 
	 * @param {number} y3 - y coordinate of the third position 
	 * @param {number} z1 - z coordinate of the first position 
	 * @param {number} z2 - z coordinate of the second position 
	 * @param {number} z3 - z coordinate of the third position 
	 */
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		// Vertex 1
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;

		// Vertex 2
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;

		// Vertex 3
		this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;

		// Side lengths
		this.a = MyTriangle.calculateDistance([x1, y1, z1], [x2, y2, z2]);
		this.b = MyTriangle.calculateDistance([x2, y2, z2], [x3, y3, z3]);
		this.c = MyTriangle.calculateDistance([x1, y1, z1], [x3, y3, z3]);

		// Auxiliar variables
		this.cosA = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);
		this.sinA = Math.sqrt(1 - Math.pow(this.cosA, 2));

		this.texBuffer = [];

		this.initBuffers();
	}

	/**
	 * Calculates the distance between two vertices
	 * @param {Array<number>} v1 - First vertex
	 * @param {Array<number>} v2 - Second
	 * @returns Distance between the two given vertices
	 */
	static calculateDistance(v1, v2) {
		return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2) + Math.pow(v1[2] - v2[2], 2));
	}
	
	/**
	 * Initializes the necessary buffers
	 */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		// Normals
		let v1 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
		let v2 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];
		let normal = vec3.create();
		vec3.cross(normal, v1, v2);

		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2]
		];
		
        this.texBuffer = [
            0, 0,
            this.a, 0,
            this.c * this.cosA, this.c * this.sinA
        ];
		this.updateTexLength(1, 1);

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * Updates the list of texture coordinates of the triangle
	 * @param {Array<number>} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	/**
	 * Updates the texture coordinates of the triangle according to the given lengths.
	 * @param {float} length_u - Horizontal length of the texture
	 * @param {float} length_v - Vertical length of the texture
	 */
	updateTexLength(length_u, length_v) {
        let coords = [
			0, 1,
			this.texBuffer[2] / length_u, 1,
			this.texBuffer[4] / length_u, 1 - (this.texBuffer[5] / length_v)
		];
		this.updateTexCoords(coords);
	}
}


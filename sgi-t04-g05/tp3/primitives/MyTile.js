import { CGFobject } from '../../lib/CGF.js';
import { MyRectangle } from './MyRectangle.js';

const DEGREE_TO_RAD = Math.PI / 180;

/**
 * MyTile
 */
export class MyTile extends CGFobject {
	/**
	 * @param {CGFScene} scene - Reference to MyScene object
     */
	constructor(scene) {
		super(scene);
		this.tileWidth = 1/8;
		this.rectangle = new MyRectangle(scene, -0.5*this.tileWidth, 0.5*this.tileWidth, -0.5*this.tileWidth, 0.5*this.tileWidth);
    }

	/**
	 * display primitive
	 */
    display() {
        if(this.scene.pickMode) {
            this.scene.pushMatrix();
            this.scene.translate(0, 0.002, 0);
            this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);
            this.rectangle.display();
            this.scene.popMatrix();
        }
    }

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
        this.rectangle.updateTexCoords(coords);
	}

	/**
	 * Updates the texture coordinates of the rectangle according to the given lengths.
	 * @param {float} length_u - Horizontal length of the texture
	 * @param {float} length_v - Vertical length of the texture
	 */
	 updateTexLength(length_u, length_v) {
		this.rectangle.updateTexLength(length_u, length_v);
	}
}


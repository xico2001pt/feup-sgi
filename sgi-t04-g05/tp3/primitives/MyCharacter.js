import { MyRectangle } from "./MyRectangle.js";
import { MyTexture } from "../models/wrappers/MyTexture.js";
import { CGFtexture } from "../../lib/CGF.js";

/**
 * Rectangle with texture coordinates that can be updated to display a character from a font texture.
 */
export class MyCharacter extends MyRectangle {
	texture = null;

	/**
	 * @param {CGFscene} scene - The scene to which the rectangle belongs
	 * @param {float} x1 - The x coordinate of the first point
	 * @param {float} x2 - The x coordinate of the second point
	 * @param {float} y1 - The y coordinate of the first point
	 * @param {float} y2 - The y coordinate of the second point
	 * @param {string} character - The character to be displayed
	 */
    constructor(scene, x1, x2, y1, y2, character) {
        super(scene, x1, x2, y1, y2);
        this.character = null;
		if(!this.texture) {
			this.texture = new MyTexture("_font", new CGFtexture(scene, "scenes/images/font.png"));
		}
		this.setCharacter(character);
    }

	/**
	 * Sets the character to be displayed.
	 * @param {string} character - The character to be displayed
	 */
    setCharacter(character) {
		if(character != this.character) {
			this.character = character;
			const offset = character.charCodeAt(0);
			const col = offset % 16;
			const row = Math.floor(offset / 16);
			this.updateTexLength(16, 16, col/16, row/16);
		}
    }

	display(){
		this.texture.getCGFTexture().bind(0);
		super.display();
	}

    /**
	 * Updates the texture coordinates of the rectangle according to the given lengths.
	 * @param {float} length_u - Horizontal length of the texture
	 * @param {float} length_v - Vertical length of the texture
     * @param {float} offset_u - Texture horizontal offset
     * @param {float} offset_v - Texture vertical offset
	 */
	updateTexLength(length_u, length_v, offset_u=0, offset_v=0) {
		let u = 1 / length_u / (this.x2 - this.x1);
		let v = 1 / length_v / (this.y2 - this.y1);
		
		let coords = [
			offset_u+0, offset_v+v,
			offset_u+u, offset_v+v,
			offset_u+0, offset_v+0,
			offset_u+u, offset_v+0
		];
		this.updateTexCoords(coords);
	}
}
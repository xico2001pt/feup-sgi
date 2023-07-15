import { MyCharacter } from "./MyCharacter.js";

/**
 * Primitive that represents a counter.
 */
export class MyCounter {
    /**
     * @param {CGFscene} scene - The scene to which the counter belongs
     */
    constructor(scene) {
        this.digits = [
            new MyCharacter(scene, -2.5, -1.5, -0.5, 0.5, "0"),
            new MyCharacter(scene, -1.5, -0.5, -0.5, 0.5, "0"),
            new MyCharacter(scene, 0.5, 1.5, -0.5, 0.5, "0"),
            new MyCharacter(scene, 1.5, 2.5, -0.5, 0.5, "0"),
        ];
        
        this.separator = new MyCharacter(scene, -0.5, 0.5, -0.5, 0.5, ":");
    }

    /**
     * Set the value of the digit in index
     * @param {int} index - The index of the digit to be set
     * @param {string} value - The value to be set
     */
    setDigit(index, value) {
        this.digits[index].setCharacter(value);
    }

    /**
     * Display the primitive
     */
    display() {
        for (const digit of this.digits) {
            digit.display();
        }
        this.separator.display();
    }
}
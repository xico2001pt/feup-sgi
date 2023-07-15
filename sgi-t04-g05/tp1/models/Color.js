/**
 * Model representing a RGBA color
 */
export class Color {
    /**
     * @param {float} r - Red component
     * @param {float} g - Green component
     * @param {float} b - Blue component
     * @param {float} a - Alpha component
     */
    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Gets the color components in a [r, g, b, a] array
     * @returns {Array<float>} - Color components
     */
    getArray() {
        return [this.r, this.g, this.b, this.a];
    }
}
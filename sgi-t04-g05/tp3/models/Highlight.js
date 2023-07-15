export class Highlight {
    constructor (color, scale_h) {
        this.color = color;
        this.scale_h = scale_h;
        this.active = true;
    }

    setActive(value) {
        this.active = value;
    }
}
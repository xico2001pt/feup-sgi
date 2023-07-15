import { Keyframe } from "../models/Keyframe.js";
import { MyKeyframeAnimation } from "../models/MyKeyframeAnimation.js";

/**
 * Class that contains all the animations used in the game
 */
export class GameAnimations {
    /**
     * Creates a new GameAnimations object.
     * @param {Tile} startTile - Start tile of the movement.
     * @param {Tile} endTile - End tile of the movement.
     * @param {boolean} liftPiece - True if the piece should be lifted, false otherwise.
     * @param {boolean} dropPiece - True if the piece should be dropped, false otherwise.
     * @returns {MyKeyframeAnimation} - Movement animation.
     */
    static createMovementAnimation(startTile, endTile, liftPiece=false, dropPiece=false) {
        let keyframes = []

        const deltaRow = endTile.row - startTile.row;
        const deltaCol = endTile.col - startTile.col;
        const tileWidth = 1/8;
        const instantOffset = liftPiece ? 0.2 : 0.01;

        if(liftPiece) {
            const groundKeyframe = {
                "translation": vec3.fromValues(-deltaCol*tileWidth, 0, -deltaRow*tileWidth),
                "rotationx": vec3.fromValues(0,0,0),
                "rotationy": vec3.fromValues(0,0,0),
                "rotationz": vec3.fromValues(0,0,0),
                "scale": vec3.fromValues(1, 1, 1),
            }
            keyframes.push(new Keyframe(0, groundKeyframe));
        } else {
            const startKeyframe = {
                "translation": vec3.fromValues(-deltaCol*tileWidth, 0.04, -deltaRow*tileWidth),
                "rotationx": vec3.fromValues(0,0,0),
                "rotationy": vec3.fromValues(0,0,0),
                "rotationz": vec3.fromValues(0,0,0),
                "scale": vec3.fromValues(1, 1, 1),
            }
            keyframes.push(new Keyframe(0, startKeyframe));
        }

        const lifted = {
            "translation": vec3.fromValues(-deltaCol*tileWidth, 0.04, -deltaRow*tileWidth),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }
        keyframes.push(new Keyframe(instantOffset, lifted));

        const velocity = 2;  // v=d/t <=> t=d/v
        const pieceArrivalInstant = (Math.abs(deltaRow) / velocity) + instantOffset;

        const end = { // Arrived at the top of the endTile
            "translation": vec3.fromValues(0, 0.04, 0),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }
        keyframes.push(new Keyframe(pieceArrivalInstant, end));

        if(dropPiece) {
            const drop = { // Dropdown
                "translation": vec3.fromValues(0,0.0,0),
                "rotationx": vec3.fromValues(0,0,0),
                "rotationy": vec3.fromValues(0,0,0),
                "rotationz": vec3.fromValues(0,0,0),
                "scale": vec3.fromValues(1, 1, 1),
            }
            keyframes.push(new Keyframe(pieceArrivalInstant + 0.2, drop));
        }

        return new MyKeyframeAnimation("_movement", keyframes, true, true);
    }

    /**
     * Creates a capture animation.
     * @param {Tile} startTile - Start tile of the movement.
     * @param {Tile} endTile - End tile of the movement.
     * @returns {MyKeyframeAnimation} - Capture animation.
     */
    static createCaptureAnimation(startTile, endTile) {
        let keyframes = []

        const deltaRow = endTile.row - startTile.row;
        const deltaCol = endTile.col - startTile.col;
        const tileWidth = 1/8;

        const start = {
            "translation": vec3.fromValues(-deltaCol*tileWidth, 0, -deltaRow*tileWidth),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }
        keyframes.push(new Keyframe(0, start));

        const collision = {
            "translation": vec3.fromValues(-deltaCol*tileWidth, 0, -deltaRow*tileWidth),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }
        keyframes.push(new Keyframe(0.2, collision));

        const points = GameAnimations.getQuadraticPoints([-deltaCol*tileWidth, 0, -deltaRow*tileWidth], [0,0,0], 0.25, 9);

        let instant = 0.3;
        for (const point of points) {
            let [x, y, z] = point;
            const transformation = {
                "translation": vec3.fromValues(x, y, z),
                "rotationx": vec3.fromValues(0,0,0),
                "rotationy": vec3.fromValues(0,0,0),
                "rotationz": vec3.fromValues(0,0,0),
                "scale": vec3.fromValues(1, 1, 1),
            }
            keyframes.push(new Keyframe(instant, transformation));
            instant += 0.1;
        }

        const end = {
            "translation": vec3.fromValues(0,0.0,0),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }
        keyframes.push(new Keyframe(1.5, end));

        return new MyKeyframeAnimation("_capture", keyframes, true, true);
    }

    /**
     * Creates a keyframe animation for the piece to be lifted and dropped
     * @param {boolean} reverse - if true, the animation will be played in reverse
     * @returns {MyKeyframeAnimation} - the animation
     */
    static createLiftAnimation(reverse) {
        let keyframes = []
        const start = {
            "translation": vec3.fromValues(0, 0, 0),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }

        const end = {
            "translation": vec3.fromValues(0, 0.04, 0),
            "rotationx": vec3.fromValues(0,0,0),
            "rotationy": vec3.fromValues(0,0,0),
            "rotationz": vec3.fromValues(0,0,0),
            "scale": vec3.fromValues(1, 1, 1),
        }

        keyframes.push(new Keyframe(0, reverse ? end : start));
        keyframes.push(new Keyframe(0.5, reverse ? start : end));

        return new MyKeyframeAnimation("_lift", keyframes, true, true);
    }

    /**
     * Gets the points of a quadratic curve
     * @param {Array} startPosition - the start position of the curve
     * @param {Array} endPosition - the end position of the curve
     * @param {number} maxHeight - the maximum height of the curve
     * @param {number} nDivisions - the number of divisions of the curve
     * @returns {Array} - the points of the curve
     */
    static getQuadraticPoints(startPosition, endPosition, maxHeight, nDivisions) {
        let [col1, y1, row1] = startPosition;
        let [col2, y2, row2] = endPosition;

        let f = (x) => (-Math.pow(2*x-1, 2) + 1) * maxHeight;
        
        let col = col1, row = row1;
        let deltaCol = (col2-col1)/(nDivisions + 1);
        let deltaRow = (row2-row1)/(nDivisions + 1);
        let deltaX = 1/(nDivisions+1)
        let x = 0;

        let points = [];
        for(let i = 0; i < nDivisions + 2; ++i, col += deltaCol, row += deltaRow, x += deltaX) {
            let y = f(x);
            points.push([col,y,row]);
        }
        return points;
    }
}
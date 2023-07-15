import { CGFcamera, CGFcameraOrtho } from "../../../lib/CGF.js";

/**
 * Model that represents a camera view
 */
export class MyView {
    /**
     * @param {string} id - Id of the view
     * @param {CGFcamera} CGFCamera - Reference to the CGFcamera
     */
    constructor(id, CGFCamera){
        this.id = id;
        this.CGFCamera = CGFCamera;
    }

    /**
     * Instantiates a perspective MyView class with the given parameters
     * @param {string} id - Id of the view
     * @param {number} angleRad - Field of view angle of the camera (in radians)
     * @param {number} near - Near clipping plane distance
     * @param {number} far - Far clipping plane distance
     * @param {vec3} position - Position of the camera
     * @param {vec3} target - Target of the camera
     * @returns Instantiated MyView class
     */
    static instantiate(id, angleRad, near, far, position, target) {
        let CGFCamera = new CGFcamera(angleRad, near, far, position, target);
        return new MyView(id, CGFCamera);
    }

    /**
     * Instantiates an orthogonal MyView class with the given parameters
     * @param {string} id - Id of the view
     * @param {number} left - Left bound of the frustum
     * @param {number} right - Right bound of the frustum
     * @param {number} bottom - Bottom bound of the frustum
     * @param {number} top - Top bound of the frustum
     * @param {number} near - Near clipping plane distance
     * @param {number} far - Far clipping plane distance
     * @param {vec3} position - Position of the camera
     * @param {vec3} target - Target of the camera
     * @param {vec3} up - Up vector
     * @returns 
     */
    static instantiateOrtho(id, left, right, bottom, top, near, far, position, target, up=vec3.fromValues(0,1,0)) {
        let CGFCameraOrtho = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);
        return new MyView(id, CGFCameraOrtho);
    }

    /**
     * Gets the id of the view
     * @returns Id of the view
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the CGFcamera reference
     * @returns CGFcamera reference
     */
    getCGFCamera() {
        return this.CGFCamera;
    }
}
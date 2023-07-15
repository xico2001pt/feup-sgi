import { CGFobject } from '../../lib/CGF.js';

/**
 * Torus primitive
 */
export class MyTorus extends CGFobject {
    /**
     * @param {CGFscene} scene - Reference to CGFscene
     * @param {number} inner - Inner radius
     * @param {number} outer - Outer radius
     * @param {number} slices - Number of sides
     * @param {number} loops - Number of turns arround the circular axis
     */
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
		this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
	}

	/**
	 * Initializes the necessary buffers
	 */
	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
        this.texCoords = [];

        let theta = 0;
        let thetaInc = 2*Math.PI / this.slices;
        let phi = 0;
        let phiInc = 2*Math.PI / this.loops;

        let phiCache = [];
		for(let loop = 0; loop <= this.loops; ++loop){
			phiCache.push([Math.sin(phi), Math.cos(phi)]);
            phi += phiInc;
		}

        for(let slice = 0; slice <= this.slices; ++slice){ // theta
            let cosTheta = Math.cos(theta);
            let sinTheta = Math.sin(theta);

            // z = r * sin(theta)
            // x = (R+r*cos(theta)) * cos(phi)
            // y = (R+r*cos(theta)) * sin(phi)
            //     ----------------
            //     sliceComponent

            const sliceComponent = this.outer+this.inner*cosTheta;
            const z = this.inner * sinTheta;

            for(let loop = 0; loop < this.loops; ++loop) { // phi
                const [sinPhi, cosPhi] = phiCache[loop];
                
                const x = sliceComponent * cosPhi;
                const y = sliceComponent * sinPhi;
                this.vertices.push(x,y,z);

                const normalX = cosTheta * cosPhi;
                const normalY = cosTheta * sinPhi;
                const normalZ = sinTheta;
                this.normals.push(normalX, normalY, normalZ);

                this.texCoords.push(loop / this.loops, slice / this.slices)
            }
            theta += thetaInc;
        }

        let sliceOffset = 0;
        for(let slice = 0; slice <= this.slices; ++slice){
            let nextSliceOffset = ((slice+1) % (this.slices+1)) * this.loops;

            for(let loop = 0; loop < this.loops; ++loop){
                let nextLoop = (loop+1) % this.loops;

                this.indices.push(
                    sliceOffset+loop, 
                    sliceOffset+nextLoop,
                    nextSliceOffset+loop
                );
                this.indices.push(
                    nextSliceOffset+loop, 
                    sliceOffset+nextLoop,
                    nextSliceOffset+nextLoop
                );
            }

            sliceOffset = nextSliceOffset;
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

    /**
	 * Updates the texture coordinates of the primitive according to the given lengths.
	 * @param {float} length_u - Horizontal length of the texture
	 * @param {float} length_v - Vertical length of the texture
	 */
    updateTexLength(length_u, length_v) {
        // Not implemented
	}
}


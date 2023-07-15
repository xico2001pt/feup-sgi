import { CGFscene } from '../lib/CGF.js';
import { CGFaxis,CGFcamera } from '../lib/CGF.js';
import {SceneRenderer} from "./rendering/SceneRenderer.js";
import { StateManager } from './game/StateManager.js';
import { PickingTypes } from "./game/PickingTypes.js";


/**
 * XMLscene class, representing the scene that is to be rendered.
 */
export class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.stateManager = new StateManager(this);
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);
        this.initScene();
    }

    initScene() {
        this.sceneInited = false;

        this.initDefaultCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(10);

        this.highlightSpeed = 500;
        this.timeFactor = 0;

        // the activation of picking capabilities in WebCGF
        // will use a shader for picking purposes (lib\shaders\picking\vertex.glsl and lib\shaders\picking\fragment.glsl)
        this.setPickEnabled(true);
    }

    /**
     * Initializes the default camera (Before graph is loaded).
     */
    initDefaultCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.targetCamera = this.camera;
    }

    /**
     * Initialize cameras based on the sceneData
     */
    initCameras() {
        this.setCamera(this.sceneData.defaultView);
        this.setTargetCamera(this.sceneData.defaultView);
        this.camerasIds = Object.keys(this.sceneData.views);
    }
    
    /**
     * Set an camera to be the active camera, based on id
     * @param {string} cameraId - Camera Id
     */
    setCamera(id) {
        this.cameraId = id;
        this.camera = this.sceneData.views[id].getCGFCamera();
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Set the target camera, based on id. Current camera will interpolate towards the target camera
     * @param {string} cameraId - Camera Id
     */
    setTargetCamera(id) {
        this.cameraId = id;
        this.targetCamera = this.sceneData.views[id].getCGFCamera();

        if(this.camera instanceof CGFcamera && this.targetCamera instanceof CGFcamera) { // Both cameras are perspective
            this.changedTargetCamera = true;
        } else {
            this.camera = this.targetCamera;
        }
    }

    /**
     * Set enabled/disabled value of a light
     * @param {int} lightIndex - Index of the lights in the this.lights array
     * @param {boolean} enabled - Boolean value
     */
    setLight(lightIndex, enabled) {
        if(enabled) {
            this.lights[lightIndex].enable();
        } else {
            this.lights[lightIndex].disable();
        }
        this.lights[lightIndex].update();
    }


    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        this.lightsIds = [];
        for (var key in this.sceneData.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.sceneData.lights.hasOwnProperty(key)) {
                this.lightsIds.push(key);
                var light = this.sceneData.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0]-light[2][0], light[9][1]-light[2][1], light[9][2]-light[2][2]);
                }

                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }

        for(;i < 8; ++i) { // Ensure extra lights are disabled
            this.lights[i].disable();
        }
    }

    /**
     * Set default appearance
     */
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded(sceneData) {
        console.log("Graph has been loaded");
        this.sceneData = sceneData;
        this.axis = new CGFaxis(this, sceneData.referenceLength);

        this.gl.clearColor(this.sceneData.background[0], this.sceneData.background[1], this.sceneData.background[2], this.sceneData.background[3]);

        this.setGlobalAmbientLight(this.sceneData.ambient[0], this.sceneData.ambient[1], this.sceneData.ambient[2], this.sceneData.ambient[3]);

        this.initLights();
        this.initCameras();

        this.renderer = new SceneRenderer(this.sceneData);

        this.interface.onGraphLoaded();

        this.sceneInited = true;
        this.startTime = null;
    }

    interpolateCamera(currTime) {
        const ANIMATION_DURATION = 2000;
        if (this.camera != this.targetCamera) { // Interpolate between both cameras
            if (this.changedTargetCamera) {
                this.changedTargetCamera = false;
                this.initialCamera = this.camera;
                this.cameraInterpolationStartInstant = currTime;
            }
            const elapsedTime = currTime - this.cameraInterpolationStartInstant;

            if (elapsedTime >= ANIMATION_DURATION) { // Interpolation is over
                this.camera = this.targetCamera;
                this.interface.setActiveCamera(this.targetCamera);
                this.cameraInterpolationStartInstant = null;
            } else {
                let fov = this.initialCamera.fov + ((this.targetCamera.fov - this.initialCamera.fov)/ANIMATION_DURATION) * elapsedTime;
                let near = this.initialCamera.near + ((this.targetCamera.near - this.initialCamera.near)/ANIMATION_DURATION) * elapsedTime;
                let far = this.initialCamera.far + ((this.targetCamera.far - this.initialCamera.far)/ANIMATION_DURATION) * elapsedTime;

                let position = vec3.create();
                vec3.lerp(position, this.initialCamera.position, this.targetCamera.position, elapsedTime / ANIMATION_DURATION);

                let target = vec3.create();
                vec3.lerp(target, this.initialCamera.target, this.targetCamera.target, elapsedTime / ANIMATION_DURATION);

                let up = vec3.create();
                vec3.lerp(up, this.initialCamera._up, this.targetCamera._up, elapsedTime / ANIMATION_DURATION);

                this.camera = new CGFcamera(fov, near, far, position, target);
                this.camera._up = up;
            }
        }
    }

    update(currTime) {
        if(this.startTime == null) {
            this.startTime = currTime;
        }
        this.timeFactor = (currTime / this.highlightSpeed) % 5000 * Math.PI;
        this.timeFactor = (Math.sin(this.timeFactor) + 1.0) / 2.0;

        if(this.sceneInited){
            for(const [id, anim] of Object.entries(this.sceneData.animations)){
                anim.update((currTime - this.startTime) / 1000);
            }
        }

        this.stateManager.update(currTime-this.startTime);
        this.interpolateCamera(currTime);
    }

    logPicking()
	{
		if (this.pickMode == false) {
			// results can only be retrieved when picking mode is false
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i=0; i< this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj)
					{
						var customId = this.pickResults[i][1];
                        this.stateManager.handleInput(this.getPickingType(customId), obj);
					}
                    
				}
				this.pickResults.splice(0,this.pickResults.length);
			}		
		}
	}

    getPickingType(id) {
        if (id < PickingTypes.ButtonSelection) {
            return PickingTypes.TileSelection;
        } else if (id < PickingTypes.None) {
            return PickingTypes.ButtonSelection;
        }
        return PickingTypes.None;
    }

    /**
     * Displays the scene.
     */
    display() {
        // When picking is enabled, the scene's display method is called once for picking, 
		// and then again for rendering.
		// logPicking does nothing in the beginning of the first pass (when pickMode is true)
		// during the first pass, a picking buffer is filled.
		// in the beginning of the second pass (pickMode false), logPicking checks the buffer and
		// collects the id's of the picked object(s) 
		this.logPicking();

		// this resets the picking buffer (association between objects and ids)
		this.clearPickRegistration();

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        // this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();
        }

        this.stateManager.display();
        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
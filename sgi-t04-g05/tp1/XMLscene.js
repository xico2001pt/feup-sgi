import { CGFscene } from '../lib/CGF.js';
import { CGFaxis,CGFcamera } from '../lib/CGF.js';
import {SceneRenderer} from "./rendering/SceneRenderer.js";


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
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initDefaultCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the default camera (Before graph is loaded).
     */
    initDefaultCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initialize cameras based on the sceneData
     */
    initCameras() {
        this.setCamera(this.sceneData.defaultView);
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
        this.lights = this.lights.slice(0, i);
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
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.sceneData.referenceLength);

        this.gl.clearColor(this.sceneData.background[0], this.sceneData.background[1], this.sceneData.background[2], this.sceneData.background[3]);

        this.setGlobalAmbientLight(this.sceneData.ambient[0], this.sceneData.ambient[1], this.sceneData.ambient[2], this.sceneData.ambient[3]);

        this.initLights();
        this.initCameras();

        this.renderer = new SceneRenderer(this.sceneData);

        this.interface.onGraphLoaded();

        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
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
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene.
            this.renderer.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
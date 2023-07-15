import { CGFinterface, dat } from '../lib/CGF.js';
import { MaterialUpdater } from './rendering/MaterialUpdater.js';

/**
* MyInterface class, creating a GUI interface.
*/
export class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    onGraphLoaded() {
        this.materialUpdater = new MaterialUpdater(this.scene.sceneData);

        if (this.cameras) this.gui.removeFolder(this.cameras);
        this.cameras = this.gui.addFolder('Camera Settings');
        this.cameras.add(this.scene, 'cameraId', this.scene.camerasIds)
            .name('Active Camera')
            .onChange((value) => {this.scene.setTargetCamera(value) });

        if (this.lights) this.gui.removeFolder(this.lights);
        this.lights = this.gui.addFolder('Lights');
        for(let i = 0; i < this.scene.lightsIds.length; ++i) {
            this.lights.add(this.scene.lights[i], 'enabled')
                .name(this.scene.lightsIds[i])
                .onChange((value) => {
                    this.scene.setLight(i, value);
            });
        }
        
        if (this.components) this.gui.removeFolder(this.components);
        this.components = this.gui.addFolder('Components');
        this.components.add(this.scene, 'highlightSpeed', 1, 2000);
        for(let [id, component] of Object.entries(this.scene.sceneData.components)) {
            if (component.highlight != null){
                this.components.add(component.highlight, 'active')
                    .name(id)
                    .onChange((value) => {
                        component.highlight.setActive(value);
                    })
            }
        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
        
        if(event.code == "KeyM") {
            this.materialUpdater.update();
        }
    }

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
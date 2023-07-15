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
        this.gui.add(this.scene, 'cameraId', this.scene.camerasIds)
            .name('Active Camera')
            .onChange((value) => {this.scene.setCamera(value) });
        let folder = this.gui.addFolder('Lights');
        for(let i = 0; i < this.scene.lights.length; ++i) {
            folder.add(this.scene.lights[i], 'enabled')
                .name(this.scene.lightsIds[i])
                .onChange((value) => {
                    this.scene.setLight(i, value);
            });
        }
        
        folder = this.gui.addFolder('Components');
        folder.add(this.scene, 'highlightSpeed', 1, 2000);
        for(let [id, component] of Object.entries(this.scene.sceneData.components)) {
            if (component.highlight != null){
                folder.add(component.highlight, 'active')
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
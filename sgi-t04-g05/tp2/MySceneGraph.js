import { CGFXMLreader, CGFshader } from '../lib/CGF.js';
import {SceneData} from "./models/SceneData.js";
import {ComponentsLinker} from "./parser/component/ComponentsLinker.js";
import {ParserErrorPrinter} from "./parser/ParserErrorPrinter.js";
import {GenericChildParser} from "./parser/GenericChildParser.js";
import {TransformationParser} from "./parser/TransformationParser.js";
import {MaterialParser} from "./parser/MaterialParser.js";
import {ComponentParser} from "./parser/component/ComponentParser.js";
import {KeyframeAnimationParser} from "./parser/animation/KeyframeAnimationParser.js";
import {PrimitiveParser} from "./parser/PrimitiveParser.js";
import {TextureParser} from "./parser/TextureParser.js";
import {ViewParser} from "./parser/ViewParser.js";
import { LightsParser } from './parser/LightsParser.js';
import {AmbientParser} from "./parser/AmbientParser.js";
import { MyView } from './models/wrappers/MyView.js';
import { MyMaterial } from './models/wrappers/MyMaterial.js';
import { Color} from "./models/Color.js";
import {RecursionChecker} from "./parser/RecursionChecker.js";


// Order of the groups in the XML document.
const SCENE_INDEX = 0;
const VIEWS_INDEX = 1;
const AMBIENT_INDEX = 2;
const LIGHTS_INDEX = 3;
const TEXTURES_INDEX = 4;
const MATERIALS_INDEX = 5;
const TRANSFORMATIONS_INDEX = 6;
const PRIMITIVES_INDEX = 7;
const ANIMATIONS_INDEX = 8;
const COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        this.sceneData = new SceneData(scene);
        scene.sceneData = this.sceneData;

        this.sceneData.highlightShader = new CGFshader(this.scene.gl, "shaders/highlight.vert", "shaders/highlight.frag");

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        const rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        const error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs")
            return "root tag <sxs> missing";

        const nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        let nodeNames = [];

        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        let error;

        // Processes each node, verifying errors.
        // <scene>
        let index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        let root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.sceneData.root = root;

        // Get axis length        
        let axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.sceneData.referenceLength = axis_length || 1;

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        let result = GenericChildParser.parse(viewsNode, this.reader, this.scene, ViewParser, "view");
        ParserErrorPrinter.print(result.getErrors());
        console.log("Views", result);
        this.sceneData.views = result.getValue();

        let defaultView = this.reader.getString(viewsNode, 'default');
        this.sceneData.defaultView = this.reader.getString(viewsNode, 'default');

        if(defaultView == null || Object.keys(this.sceneData.views).indexOf(defaultView) === -1) {
            if(Object.keys(this.sceneData.views).length > 0) {
                defaultView = Object.keys(this.sceneData.views)[0];
                this.onXMLMinorError("no default view defined, defaulting to view with id=" + defaultView);
            } else {
                defaultView = 'default_view';
                this.sceneData.views['default_view'] = MyView.instantiate('default_view', 1.5, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
                this.onXMLMinorError("no default view defined and no views were defined, creating a default view");
            }
        }

        this.sceneData.defaultView = defaultView;

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {
        let result = AmbientParser.parse(ambientsNode, this.reader);
        ParserErrorPrinter.print(result.getErrors());
        console.log("Ambient", result);
        this.sceneData.ambient = result.getValue()['ambient'];
        this.sceneData.background = result.getValue()['background'];
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        let result = LightsParser.parse(lightsNode, this.reader);
        this.sceneData.lights = result.getValue();
        ParserErrorPrinter.print(result.getErrors());
        console.log("Lights", result.getValue());
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        let result = GenericChildParser.parse(texturesNode, this.reader, this.scene, TextureParser, "texture");
        this.sceneData.textures = result.getValue();
        console.log("Textures", result);
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        let result = GenericChildParser.parse(materialsNode, this.reader, this.scene, MaterialParser, "material");
        this.sceneData.materials = result.getValue();
        console.log("Materials", result);
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        let result = GenericChildParser.parse(transformationsNode, this.reader, this.scene, TransformationParser, "transformation");
        this.sceneData.transformations = result.getValue();
        ParserErrorPrinter.print(result.getErrors());
        console.log("Transformations", result);
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        let result = GenericChildParser.parse(primitivesNode, this.reader, this.scene, PrimitiveParser, "primitive");
        this.sceneData.primitives = result.getValue();
        console.log("Primitives", result);
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        let result = GenericChildParser.parse(animationsNode, this.reader, this.scene, KeyframeAnimationParser, "keyframeanim");
        this.sceneData.animations = result.getValue();
        ParserErrorPrinter.print(result.getErrors());
        console.log("Animations", result);
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        let result = GenericChildParser.parse(componentsNode, this.reader, this.sceneData, ComponentParser, "component");
        ParserErrorPrinter.print(result.getErrors());
        this.sceneData.components = result.getValue();

        console.log("Linking child components");
        ParserErrorPrinter.print(ComponentsLinker.link(this.sceneData));

        if(!(this.sceneData.root in this.sceneData.components)) {
            if(Object.keys(this.sceneData.components).length > 0) {
                this.onXMLMinorError("root component not found, defaulting to first component");
                this.sceneData.root = Object.keys(this.sceneData.components)[0];
            } else {
                return "no components defined";
            }
        }

        console.log("Checking for recursion");
        ParserErrorPrinter.print(RecursionChecker.checkRecursion(this.sceneData));

        let rootMaterials = this.sceneData.components[this.sceneData.root].materials;
        // Ensure the scene is rendered, even if the root node has no valid material
        rootMaterials = rootMaterials.filter(mat => (mat != "inherit")); // Remove inherited materials from root node
        if(rootMaterials.length == 0){ // Make sure root node has at least one material
            this.onXMLMinorError("Root component has no valid materials, creating default material");
            const color = new Color(0.5, 0.5, 0.5, 1);
            rootMaterials.push(MyMaterial.instantiate(null, color, color, color, color, 10, this.scene));
        }
        this.sceneData.components[this.sceneData.root].materials = rootMaterials;

        console.log("Components", result);
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }
}
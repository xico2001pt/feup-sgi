import { ParserResult } from "./ParserResult.js";
import { FloatParser } from "./FloatParser.js";
import { IntegerParser } from "./IntegerParser.js";
import { Coordinate3DParser } from "./Coordinate3DParser.js";
import { MyRectangle } from "../primitives/MyRectangle.js";
import { MyCharacter } from "../primitives/MyCharacter.js";
import { MyTriangle } from "../primitives/MyTriangle.js";
import { MyCylinder } from "../primitives/MyCylinder.js";
import { MySphere } from "../primitives/MySphere.js";
import { MyTorus } from "../primitives/MyTorus.js";
import {PrimitiveNode} from "../models/graph/PrimitiveNode.js";
import { MyPatch } from "../primitives/MyPatch.js";
import { CGFOBJModel } from "../primitives/CGFOBJModel.js";
import { MyCounter } from "../primitives/MyCounter.js";

/**
 * Parser for the <primitive> node
 */
export class PrimitiveParser {
    /**
     * Parse the <primitive> node
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parse(node, reader, scene) {
        if (node.nodeName !== "primitive") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        let id = reader.getString(node, "id");
        if (id == null) {
            return ParserResult.fromError("no id defined for primitive");
        }

        if (node.children.length === 1) {
            let childNode = node.children[0];
            let primitiveType = childNode.nodeName;

            if (primitiveType === 'rectangle') {
                return PrimitiveParser.parseRectangle(childNode, reader, scene, id);
            } else if (primitiveType === 'triangle') {
                return PrimitiveParser.parseTriangle(childNode, reader, scene, id);
            } else if (primitiveType === 'cylinder') {
                return PrimitiveParser.parseCylinder(childNode, reader, scene, id);
            } else if (primitiveType === 'sphere') {
                return PrimitiveParser.parseSphere(childNode, reader, scene, id);
            } else if (primitiveType === 'torus') {
                return PrimitiveParser.parseTorus(childNode, reader, scene, id);
            } else if (primitiveType === 'patch') {
                return PrimitiveParser.parsePatch(childNode, reader, scene, id);
            } else if (primitiveType === 'obj') {
                return PrimitiveParser.parseObj(childNode, reader, scene, id);
            } else if (primitiveType === 'character') {
                return PrimitiveParser.parseChar(childNode, reader, scene, id);
            } else if (primitiveType === 'counter') {
                return PrimitiveParser.parseCounter(childNode, reader, scene, id);
            }
        }
        return ParserResult.fromError("There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)");
    }
    
    /**
     * Parse the rectangle primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parseRectangle(node, reader, scene, id) {
        let x1 = FloatParser.parse(node, reader, 'x1');
        let y1 = FloatParser.parse(node, reader, 'y1');
        let x2 = FloatParser.parse(node, reader, 'x2', x1.getValueOrDefault(0));
        let y2 = FloatParser.parse(node, reader, 'y2', y1.getValueOrDefault(0));

        let rectangle = new MyRectangle(
            scene, 
            x1.getValueOrDefault(0), 
            x2.getValueOrDefault(1), 
            y1.getValueOrDefault(0), 
            y2.getValueOrDefault(1)
        );
        return ParserResult.collect(
            new PrimitiveNode(id, rectangle),
            [x1, y1, x2, y2],
            "parsing <rectangle> with id=" + id
        );
    }

    /**
     * Parse the char primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
     static parseChar(node, reader, scene, id) {
        let x1 = FloatParser.parse(node, reader, 'x1');
        let y1 = FloatParser.parse(node, reader, 'y1');
        let x2 = FloatParser.parse(node, reader, 'x2', x1.getValueOrDefault(0));
        let y2 = FloatParser.parse(node, reader, 'y2', y1.getValueOrDefault(0));
        let char = reader.getString(node, "char");

        let character = new MyCharacter(
            scene, 
            x1.getValueOrDefault(0), 
            x2.getValueOrDefault(1), 
            y1.getValueOrDefault(0), 
            y2.getValueOrDefault(1),
            char
        );
        return ParserResult.collect(
            new PrimitiveNode(id, character),
            [x1, y1, x2, y2],
            "parsing <character> with id=" + id
        );
    }

    /**
     * Parse the counter primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
     static parseCounter(node, reader, scene, id) {
        const counter = new MyCounter(scene);
        return ParserResult.fromValue(new PrimitiveNode(id, counter));
    }

    /**
     * Parse the triangle primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parseTriangle(node, reader, scene, id) {
        let x1 = FloatParser.parse(node, reader, 'x1');
        let y1 = FloatParser.parse(node, reader, 'y1');
        let z1 = FloatParser.parse(node, reader, 'z1');

        let x2 = FloatParser.parse(node, reader, 'x2');
        let y2 = FloatParser.parse(node, reader, 'y2');
        let z2 = FloatParser.parse(node, reader, 'z2');

        let x3 = FloatParser.parse(node, reader, 'x3');
        let y3 = FloatParser.parse(node, reader, 'y3');
        let z3 = FloatParser.parse(node, reader, 'z3');

        let triangle = new MyTriangle(
            scene, 
            x1.getValueOrDefault(0), 
            x2.getValueOrDefault(1),
            x3.getValueOrDefault(0),
            y1.getValueOrDefault(0),
            y2.getValueOrDefault(0),
            y3.getValueOrDefault(1),
            z1.getValueOrDefault(0),
            z2.getValueOrDefault(0),
            z3.getValueOrDefault(0)
        );

        return ParserResult.fromValue(
            new PrimitiveNode(id, triangle),
            [x1,y1,z1,x2,y2,z2,x3,y3,z3],
            "parsing <triangle> with id=" + id);
    }

    /**
     * Parse the cylinder primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parseCylinder(node, reader, scene, id) {
        let baseRadius = FloatParser.parse(node, reader, 'base', 0);
        let topRadius = FloatParser.parse(node, reader, 'top', 0);
        let height = FloatParser.parse(node, reader, 'height', 0);
        let slices = IntegerParser.parse(node, reader, 'slices', 1);
        let stacks = IntegerParser.parse(node, reader, 'stacks', 1);

        let collection = ParserResult.collect(null, [baseRadius, topRadius, height, slices, stacks]);
        if (collection.hasError()) {
            return collection;
        }

        let cylinder = new MyCylinder(
            scene, 
            baseRadius.getValueOrDefault(1),
            topRadius.getValueOrDefault(1),
            height.getValueOrDefault(1),
            slices.getValueOrDefault(8),
            stacks.getValueOrDefault(8)
        );
        
        return ParserResult.collect(
            new PrimitiveNode(id, cylinder),
            [baseRadius, topRadius, height, slices, stacks],
            "parsing <cylinder> with id=" + id
        );
    }

    /**
     * Parse the sphere primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parseSphere(node, reader, scene, id) {
        let radius = FloatParser.parse(node, reader, 'radius', 0);
        let slices = IntegerParser.parse(node, reader, 'slices', 1);
        let stacks = IntegerParser.parse(node, reader, 'stacks', 1);

        let sphere = new MySphere(
            scene, 
            radius.getValueOrDefault(1),
            slices.getValueOrDefault(8),
            stacks.getValueOrDefault(8)
        );

        return ParserResult.collect(
            new PrimitiveNode(id, sphere),
            [radius, slices, stacks],
            "parsing <sphere> with id=" + id
        );
    }

    /**
     * Parse the torus primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parseTorus(node, reader, scene, id) {
        let inner = FloatParser.parse(node, reader, 'inner', 0);
        let outer = FloatParser.parse(node, reader, 'outer', 0);
        let slices = IntegerParser.parse(node, reader, 'slices', 1);
        let loops = IntegerParser.parse(node, reader, 'loops', 1);

        let torus = new MyTorus(
            scene, 
            inner.getValueOrDefault(1),
            outer.getValueOrDefault(1),
            slices.getValueOrDefault(8),
            loops.getValueOrDefault(8)
        );

        return ParserResult.collect(
            new PrimitiveNode(id, torus),
            [inner, outer, slices, loops],
            "parsing <torus> with id=" + id
        );
    }

    /**
     * Parse the patch primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parsePatch(node, reader, scene, id) {
        let results = [];

        let degree_uResult = IntegerParser.parse(node, reader, 'degree_u', 1);
        let degree_vResult = IntegerParser.parse(node, reader, 'degree_v', 1);
        let parts_u = IntegerParser.parse(node, reader, 'parts_u', 1);
        let parts_v = IntegerParser.parse(node, reader, 'parts_v', 1);
        
        results.push(degree_uResult);
        results.push(degree_vResult);
        results.push(parts_u);
        results.push(parts_v);
        
        const degree_u = degree_uResult.getValueOrDefault(1);
        const degree_v = degree_vResult.getValueOrDefault(1);
        
        const nControlVertices = (degree_u + 1) * (degree_v + 1);

        if(nControlVertices != node.children.length) {
            return ParserResult.fromError("Invalid number of control vertices for patch with id=" + id);
        }

        let points = [];
        let sublist = [];
        const weight = 1.0;
        for(const child of node.children) {
            if(child.nodeName != "controlpoint") {
                return ParserResult.fromError("Invalid child node for patch with id=" + id);
            }
            const coordinatesResult = Coordinate3DParser.parse(child, reader);
            const coordinates = coordinatesResult.getValue().getArray();
            coordinates.push(weight);
            sublist.push(coordinates);
            
            if (sublist.length == (degree_v + 1)) {
                points.push(sublist); 
                sublist = [];
            }
            results.push(coordinatesResult);
        }

        let patch = new MyPatch(
            scene, 
            degree_u, 
            degree_v,
            points,
            parts_u.getValueOrDefault(1),
            parts_v.getValueOrDefault(1)
        );
        return ParserResult.collect(new PrimitiveNode(id, patch), results, "parsing <patch> with id=" + id);
    }

    /**
     * Parse the obj primitive
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @param {string} id - Id of the primitive
     * @returns ParserResult containing an object with the parsed primitive and errors that occurred while parsing
     */
    static parseObj(node, reader, scene, id) {
        let fileUrl = reader.getString(node, 'file');
        if (fileUrl == null) {
            return ParserResult.fromError("no file defined for obj with ID = " + id);
        }

        return ParserResult.fromValue(new PrimitiveNode(id, new CGFOBJModel(scene, fileUrl)));
    }
}
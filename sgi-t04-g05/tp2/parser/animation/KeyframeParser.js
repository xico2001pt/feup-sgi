import { FloatParser } from "../FloatParser.js";
import { TransformationParser } from "../TransformationParser.js";
import { ParserResult } from "../ParserResult.js";
import { Keyframe } from "../../models/Keyframe.js";
import { Coordinate3DParser } from "../Coordinate3DParser.js";
import { RotationParser } from "../RotationParser.js";

const TRANSLATION_INDEX = 0;
const ROTATION_Z_INDEX = 1;
const ROTATION_Y_INDEX = 2;
const ROTATION_X_INDEX = 3;
const SCALE_INDEX = 4;

/**
 * Class for parsing keyframes.
 */
export class KeyframeParser {
    static parse(node, reader, scene) {
        if (node.nodeName !== "keyframe") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        const instantResult = FloatParser.parse(node, reader, "instant");
        
        if (node.children.length !== 5) {
            return ParserResult.fromError("invalid number of children for tag <" + node.nodeName + ">, expected 5 but received " + node.children.length);
        }

        if (KeyframeParser.hasOrderError(node, reader)) {
            return ParserResult.fromError("transformation order is incorrect for keyframe in instant ", instantResult.getValueOrDefault(0));
        }

        const transformationResult = this.parseTransformation(node, reader, scene);

        return ParserResult.collect(
            new Keyframe(
                instantResult.getValueOrDefault(0),
                transformationResult.getValueOrDefault(
                    {
                        "translation": vec3.fromValues(0, 0, 0),
                        "rotationz": vec3.fromValues(0, 0, 0), 
                        "rotationy": vec3.fromValues(0, 0, 0), 
                        "rotationx": vec3.fromValues(0, 0, 0),
                        "scale": vec3.fromValues(1, 1, 1)
                    }
                )
            ), 
            [instantResult, transformationResult]
        );
    }

    static hasOrderError(node, reader) {
        let transformations = [];
        for (const child of node.children) {
            let name = child.nodeName;
            if (name === "rotation") {
                const axis = reader.getString(child, 'axis');
                if (!(axis != null && axis.length === 1 && ['x', 'y', 'z'].includes(axis)))
                    return ParserResult.fromError("unable to parse axis");
                name += axis;
            }
            transformations.push(name);
        }

        return transformations[TRANSLATION_INDEX] !== "translation" ||
            transformations[ROTATION_Z_INDEX] !== "rotationz" ||
            transformations[ROTATION_Y_INDEX] !== "rotationy" ||
            transformations[ROTATION_X_INDEX] !== "rotationx" ||
            transformations[SCALE_INDEX] !== "scale";
    }

    static parseTransformation(node, reader, scene) {
        let results = [];

        // Translation
        let translate_coordinates = Coordinate3DParser.parse(node.children[TRANSLATION_INDEX], reader);
        results.push(translate_coordinates);

        // Rotation
        let rotations = [];
        for(const index of [ROTATION_Z_INDEX, ROTATION_Y_INDEX, ROTATION_X_INDEX]){
            let rotation = RotationParser.parse(node.children[index], reader);
            results.push(rotation);
            rotations.push(rotation.getValue().angle);
        }

        // Scale
        let scale_coordinates = Coordinate3DParser.parse(node.children[SCALE_INDEX], reader, ["sx","sy","sz"]);
        results.push(scale_coordinates);

        return ParserResult.collect({
            "translation": vec3.fromValues(...translate_coordinates.getValue().getArray()),
            "rotationz": vec3.fromValues(rotations[0],0,0), 
            "rotationy": vec3.fromValues(rotations[1],0,0), 
            "rotationx": vec3.fromValues(rotations[2],0,0),
            "scale": vec3.fromValues(...scale_coordinates.getValue().getArray())
        }, results);
    }
}
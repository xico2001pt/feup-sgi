import { ParserResult } from "./ParserResult.js";
import { MyTransformation } from "../models/wrappers/MyTransformation.js";
import { RotationParser } from "./RotationParser.js";
import { Coordinate3DParser } from "./Coordinate3DParser.js";

/**
 * Parser for the <transformation> node
 */
export class TransformationParser {
    /**
     * Parse the <transformation> node
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {boolean} needsId - Indicates if the transformation needs to have an id
     * @returns ParserResult containing an object with the parsed transformation and errors that occurred while parsing
     */
    static parse(node, reader, needsId=true) {
        if(node.nodeName !== "transformation") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        let id = null;
        if(needsId){
            id = reader.getString(node, "id");
            if (id == null) {
                return ParserResult.fromError("no ID defined for transformation");
            }
        }

        let transformationMatrix = mat4.create();
        let results = [];
        let errors = [];

        for(let child of node.children) {
            switch(child.nodeName) {
                case 'translate':
                    let translate_coordinates = Coordinate3DParser.parse(child, reader);
                    if(!translate_coordinates.hasError()){
                        transformationMatrix = mat4.translate(
                            transformationMatrix, 
                            transformationMatrix, 
                            translate_coordinates.getValue().getArray()
                        );
                    } else {
                        results.push(translate_coordinates);
                    }
                    break;
                case 'scale':
                    let scale_coordinates = Coordinate3DParser.parse(child, reader);
                    if(!scale_coordinates.hasError()){
                        transformationMatrix = mat4.scale(
                            transformationMatrix, 
                            transformationMatrix, 
                            scale_coordinates.getValue().getArray()
                        );
                    } else {
                        results.push(scale_coordinates);
                    }
                    break;
                case 'rotate':
                    let rotation = RotationParser.parse(child, reader);
                    if(!rotation.hasError()){
                        transformationMatrix = mat4.rotate(
                            transformationMatrix, 
                            transformationMatrix, 
                            rotation.getValue().getAngle(),
                            rotation.getValue().getAxisArray()
                        );
                    } else {
                        results.push(rotation);
                    }
                    break;
                default:
                    errors.push("unknown tag <" + child.nodeName + ">");
                    break;
            }
        }
        return ParserResult.collect(new MyTransformation(id, transformationMatrix), results, "parsing <transformation>", errors);
    }
}
import { ParserResult } from "./ParserResult.js";
import { Rotation } from "../models/Rotation.js";
import { FloatParser } from "./FloatParser.js";

/**
 * Parser for the node with rotation attributes
 */
export class RotationParser {
    /**
     * Parse the <view> node
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @returns ParserResult containing an object with the parsed rotation and errors that occurred while parsing
     */
    static parse(node, reader){
        let errors = [];

        // Get axis
        const axis = reader.getString(node, 'axis');
        if (!(axis != null && axis.length === 1 && ['x', 'y', 'z'].includes(axis)))
            return ParserResult.fromError("unable to parse axis");

        // Get angle
        const angleResult = FloatParser.parse(node, reader, 'angle');
        if(angleResult.hasError()){
            return new ParserResult(null, angleResult.getErrors());
        }

        return ParserResult.fromValue(new Rotation(axis, angleResult.getValue()));
    }
}
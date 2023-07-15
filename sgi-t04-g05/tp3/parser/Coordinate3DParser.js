import { ParserResult } from "./ParserResult.js";
import { FloatParser } from "./FloatParser.js";
import { Coordinate3D } from "../models/Coordinate3D.js";

/**
 * Parser for a node with 3d coordinates
 */
export class Coordinate3DParser {
    /**
     * Parse a node with 3d coordinates
     * @param {element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @returns {ParserResult} - Containing a Coordinate3D object with the parsed coordinates, and errors that occurred while parsing
     */
    static parse(node, reader, attributeList=["x", "y", "z"]) {
        let x = FloatParser.parse(node, reader, attributeList[0]);
        let y = FloatParser.parse(node, reader, attributeList[1]);
        let z = FloatParser.parse(node, reader, attributeList[2]);

        return ParserResult.collect(
            new Coordinate3D(x.getValueOrDefault(0), y.getValueOrDefault(0), z.getValueOrDefault(0)),
            [x, y, z],
            "parsing xyz coordinates"
        );
    }
}
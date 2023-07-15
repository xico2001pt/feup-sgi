import { FloatParser } from "./FloatParser.js";
import { ParserResult } from "./ParserResult.js";
import { Color } from "../models/Color.js";

/**
 * Parser for the node with color attributes
 */
export class ColorParser {
    /**
     * Parse the node with color attributes
     * @param {element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @returns {ParserResult} - Containing a Color object with the parsed color, and errors that occurred while parsing
     */
    static parse(node, reader, alphaValue=1.0) {
        let r = FloatParser.parse(node, reader, 'r', 0, 1);
        let g = FloatParser.parse(node, reader, 'g', 0, 1);
        let b = FloatParser.parse(node, reader, 'b', 0, 1);
        let results = [r,g,b];

        let a = alphaValue;
        if(a == null) {
            a = FloatParser.parse(node, reader, 'a', 0, 1);
            results.push(a);
            a = a.getValueOrDefault(1);
        }
        
        
        
        return ParserResult.collect(
            new Color(r.getValueOrDefault(0), g.getValueOrDefault(0), b.getValueOrDefault(0), a),
            results,
            "parsing rgba color"
        );
    }
}
import {ColorParser} from "./ColorParser.js";
import {ParserResult} from "./ParserResult.js";
import {Color} from "../models/Color.js";

/**
 * Parser for the <ambient> node
 */
export class AmbientParser {
    /**
     * Parse the <ambient> node
     * @param {ambient element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @returns {ParserResult} - Containing a object with the parsed ambient and background colors, and errors that occurred while parsing
     */
    static parse(node, reader) {
        let ambient = [];
        let background = [];
        let errors = [];
        let nodeNames = [];
        for(const child of node.children) {
            nodeNames.push(child.nodeName);
        }

        const ambientIndex = nodeNames.indexOf("ambient");
        const backgroundIndex = nodeNames.indexOf("background");
        let results = [];
        if(ambientIndex != -1) {
            var ambientColorResult = ColorParser.parse(node.children[ambientIndex], reader);
            ambient = ambientColorResult.getValue();
            results.push(ambientColorResult);
        } else {
            ambient = new Color(0,0,0,0);
            errors.push("missing <ambient> tag")
        }

        if(backgroundIndex != -1) {
            var backgroundColorResult = ColorParser.parse(node.children[backgroundIndex], reader);
            background = backgroundColorResult.getValue();
            results.push(backgroundColorResult);
        } else {
            background = new Color([0,0,0,0]);
            errors.push("missing <background> tag");
        }


        return ParserResult.collect(
                {"ambient": ambient.getArray(), "background": background.getArray()},
                results,
                "parsing <ambient>",
                errors);
    }
}
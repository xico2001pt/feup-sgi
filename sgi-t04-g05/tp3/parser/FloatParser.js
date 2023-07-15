import { ParserResult } from "./ParserResult.js";

/**
 * Parser for a float attribute from a node
 */
export class FloatParser {
    /**
     * Parse a float attribute from a node
     * @param {element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @param {string} attributeName - Name of the attribute that should be parsed
     * @param {float} minLimit - Minimum value of the attribute
     * @param {float} maxLimit - Maximum value of the attribute
     * @returns {ParserResult} - Containing a float with the parsed attribute, and errors that occurred while parsing
     */
    static parse(node, reader, attributeName, minLimit=Number.NEGATIVE_INFINITY, maxLimit=Number.POSITIVE_INFINITY) {
        let value = reader.getFloat(node, attributeName);
        if(!(value != null && !isNaN(value) && value >= minLimit && value <= maxLimit))
            return ParserResult.fromError("unable to parse " + attributeName);
        return ParserResult.fromValue(value);
    }
}
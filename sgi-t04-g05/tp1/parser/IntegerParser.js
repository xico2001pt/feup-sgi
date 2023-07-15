import { ParserResult } from "./ParserResult.js";

/**
 * Parse a integer attribute from a node
 */
export class IntegerParser {
    /**
     * Parse a integer attribute from a node
     * @param {element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @param {string} attributeName - Name of the attribute that should be parsed
     * @param {int} minLimit - Minimum value of the attribute
     * @param {int} maxLimit - Maximum value of the attribute
     * @returns {ParserResult} - Containing a integer with the parsed attribute, and errors that occurred while parsing
     */
    static parse(node, reader, attributeName, minLimit=Number.NEGATIVE_INFINITY, maxLimit=Number.POSITIVE_INFINITY) {
        let value = reader.getInteger(node, attributeName);
        if(!(value != null && !isNaN(value) && value >= minLimit && value <= maxLimit))
            return ParserResult.fromError("unable to parse " + attributeName);
        return ParserResult.fromValue(value);
    }
}
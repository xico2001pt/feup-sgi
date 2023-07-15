import {ParserResult} from "./ParserResult.js";

/**
 * Parser for block level elements with common substructure
 * Applied to <materials>, <textures>, <transformations>, etc... that contain sub elements <material>, <texture>, etc...
 */
export class GenericChildParser {
    /**
     * Parse a block element node
     * @param {element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @param arg - Argument that should be passed to the parse function of the child parser
     * @param parserClass - Parser class that should be used to parse child nodes
     * @param {string} typeName - Type of the child nodes for context and error messages
     * @returns {ParserResult} - Containing an dict with id:parsedChildNode structure, and errors that occurred while parsing
     */
    static parse(node, reader, arg, parserClass, typeName="") {
        let output = {};
        let results = [];
        let errors = [];

        for(let child of node.children){
            const result = parserClass.parse(child, reader, arg);
            const v = result.getValue();
            results.push(result);

            if(v != null){
                if(output[v.getId()] == null){
                    output[v.getId()] = v;
                } else {
                    errors.push(typeName + " with id=" + v.getId() + " already exists");
                } 
            }
        }

        return ParserResult.collect(output, results, "parsing <" + typeName + "s>", errors);
    }
}
import {ParserResult} from "../ParserResult.js";

/**
 * Parse the <children> element inside a <component> element
 */
export class ComponentChildrenParser {
    /**
     * Parse the <children> element inside a <component> element
     * @param {children element} node - <children> element
     * @param {XMLReader} reader - XMLReader
     * @returns {ParserResult} - ParserResult with a Object containing a list of component ids and a list of primitive ids, and errors that occurred while parsing
     */
    static parse(node, reader) {
        let components = [];
        let primitives = [];
        let errors = [];

        for(const child of node.children) {
            let childNodeName = child.nodeName;

            let id = reader.getString(child, "id");
            if(childNodeName === "componentref") {
                if(id != null){
                    components.push(id);
                } else {
                    errors.push("no ID defined for componentref");
                }
            } else if (childNodeName === "primitiveref") {
                if(id != null) {
                    primitives.push(id);
                } else {
                    errors.push("no ID defined for primitiveref");
                }
            } else {
                errors.push("unknown tag <" + childNodeName + ">");
            }
        }
        return new ParserResult({'components': components, 'primitives': primitives}, errors);
    }
}
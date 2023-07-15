import { ParserResult } from "./ParserResult.js";

/**
 * Parser for nested elements within a block
 */
export class BlockParser {
    /**
     * Pass a tag block (<material> for example, receiving a map that matches each subtag to an handler function
     * Example: 
     * <material>
     *      <subtag1/> 
     *      <subtag2/>
     * </material>
     * 
     * tagHandlerMap
     * {
     *   "subtag1": [func, [0, 0, 0, 1]], where func is a function that receives the <subtag1/> node 
     *                                  and the second element the default value to be used in case of error
     *   "subtag2": [func, [0, 0, 0, 1]],
     * }
     * 
     * @param {block element} node - Root node of the block that should be parsed
     * @param {dict} tagHandlerMap
     * @returns {ParserResult} - Containing the parsed block and errors that occurred while parsing
     */
    static parse(node, tagHandlerMap){
        let children = node.children;

        let result = {};
        let errors = [];

        for(const child of children){
            let name = child.nodeName;
            if(tagHandlerMap.has(name)){
                if(result[name] != null){
                    errors.push("Duplicate tag <" + name + "/>");
                } else {
                    const parseResult = tagHandlerMap.get(name)[0](child);
                    errors = errors.concat(parseResult.getErrors());
                    result[name] = parseResult.getValueOrDefault(tagHandlerMap.get(name)[1]);
                }
            } else {
                errors.push("Unexpected tag <" + name + "/>");
            }
        }

        for(const tag of tagHandlerMap.keys()){
            if(result[tag] == null){
                errors.push("Expected tag <" + tag + "/>");
                result[tag] = tagHandlerMap.get(tag)[1];
            }
        }
        
        return new ParserResult(result, errors);
    }
}
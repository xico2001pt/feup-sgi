import {TransformationParser} from "../TransformationParser.js";
import {ParserResult} from "../ParserResult.js";

/**
 * Class responsible for parsing a component transformation
 */
export class ComponentTransformationParser {
    static embeddedTransformationCount = 0;

    /**
     * Parses the transformation in the given node
     * @param {*} node - XML node that contains the transformation
     * @param {*} reader - XML reader
     * @param {SceneData} sceneData - Reference to the SceneData
     * @returns Reference to the ParseResult
     */
    static parse(node, reader, sceneData){
        if (node.nodeName !== "transformation") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }
        const children = node.children;
        let id = "";
        if (children.length === 1 && children[0].nodeName === "transformationref") {
            id = reader.getString(children[0], 'id');
            if (sceneData.transformations[id] == null) {
                return ParserResult.fromError("transformation with id=" + id + " is not defined");
            }
        } else {
            if (children.length > 0) {
                const transformationMatrixResult = TransformationParser.parse(node, reader, false);
                return ParserResult.collect(transformationMatrixResult.getValue().getMat(), [transformationMatrixResult], "parsing <transformation>");
            } else {
                return ParserResult.fromValue(null);
            }
        }
        return ParserResult.fromValue(sceneData.transformations[id].getMat());
    }
}
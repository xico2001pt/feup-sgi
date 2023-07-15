import { ParserResult } from "./ParserResult.js";
import { ColorParser } from "./ColorParser.js";
import { Color } from "../models/Color.js";
import { FloatParser } from "./FloatParser.js";
import { BlockParser } from "./BlockParser.js";
import { MyMaterial } from "../models/wrappers/MyMaterial.js";

/**
 * Parser for the <material> node
 */
export class MaterialParser {
    /**
     * Parse the <material> node
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @returns ParserResult containing an object with the parsed material and errors that occurred while parsing
     */
    static parse(node, reader, scene) {
        if (node.nodeName != "material") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        let id = reader.getString(node, "id");
        if (id == null) {
            return ParserResult.fromError("no ID defined for material");
        }

        let shininessResult = FloatParser.parse(node, reader, "shininess");

        const defaultColor = new Color(0,0,0,1);

        const func = (n) => ColorParser.parse(n, reader);
        const handlerEntries = {
            "emission": [func, defaultColor],
            "ambient": [func, defaultColor],
            "diffuse": [func, defaultColor],
            "specular": [func, defaultColor],
        };
        const handlerMap = new Map(Object.entries(handlerEntries));
        const parseResult = BlockParser.parse(node, handlerMap);

        const components = parseResult.getValue();
        let mat = MyMaterial.instantiate(
            id,
            components["ambient"],
            components["diffuse"],
            components["specular"],
            components["emission"],
            shininessResult.getValueOrDefault(10),
            scene
        );
        return ParserResult.collect(mat, [shininessResult, parseResult], "parsing <material> with id=" + id);
    }
}
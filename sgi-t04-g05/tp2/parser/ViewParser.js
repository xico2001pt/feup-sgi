import { ParserResult } from "./ParserResult.js";
import { FloatParser } from "./FloatParser.js";
import { BlockParser } from "./BlockParser.js";
import { Coordinate3DParser } from "./Coordinate3DParser.js";
import { Coordinate3D } from "../models/Coordinate3D.js";
import { MyView } from "../models/wrappers/MyView.js";

var DEGREE_TO_RAD = Math.PI / 180;

/**
 * Parser for the <view> node
 */
export class ViewParser {
    /**
     * Parse the <view> node
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @returns ParserResult containing an object with the parsed view and errors that occurred while parsing
     */
    static parse(node, reader) {
        if (node.nodeName != "perspective" && node.nodeName != "ortho") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }
        let id = reader.getString(node, "id");

        if (id == null)
            return ParserResult.fromError("no ID defined for view");
        
        let near = FloatParser.parse(node, reader, "near", 0);
        let far = FloatParser.parse(node, reader, "far", 0);

        const defaultCoord = new Coordinate3D(0, 0, 0);
        const func = (c) => Coordinate3DParser.parse(c, reader);
        const handlerEntries = {
            "from": [func, defaultCoord],
            "to": [func, defaultCoord]
        };

        const handlerMap = new Map(Object.entries(handlerEntries));
        const result = BlockParser.parse(node, handlerMap);

        if (node.nodeName == "perspective") {
            let angle = FloatParser.parse(node, reader, "angle", 0);

            let view = MyView.instantiate(
                id, 
                angle.getValueOrDefault(90) * DEGREE_TO_RAD, 
                near.getValueOrDefault(0),
                far.getValueOrDefault(100),
                vec3.fromValues(...result.getValue()["from"].getArray()),
                vec3.fromValues(...result.getValue()["to"].getArray())
            );

            return ParserResult.fromValue(
                view,
                [angle, near, far, result],
                "parsing <perspective> with id=" + id
            );
        } else if (node.nodeName == "ortho") {
            let left = FloatParser.parse(node, reader, "left");
            let right = FloatParser.parse(node, reader, "right");
            let top = FloatParser.parse(node, reader, "top");
            let bottom = FloatParser.parse(node, reader, "bottom");

            let up = ParserResult.fromValue(new Coordinate3D(0, 1, 0));
            for (const child of node.children) {
                if (child.nodeName == "up") {
                    up = Coordinate3DParser.parse(child, reader);
                }
            }

            let viewOrtho = MyView.instantiateOrtho(
                id,
                left.getValueOrDefault(-10),
                right.getValueOrDefault(10),
                bottom.getValueOrDefault(-10),
                top.getValueOrDefault(10),
                near.getValueOrDefault(0),
                far.getValueOrDefault(100),
                vec3.fromValues(...result.getValue()["from"].getArray()),
                vec3.fromValues(...result.getValue()["to"].getArray()),
                up.getValueOrDefault([0,1,0]).getArray()
            );

            return ParserResult.fromValue(viewOrtho);
        }
    }
}
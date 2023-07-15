import { ParserResult } from "./ParserResult.js";
import { MyTexture } from "../models/wrappers/MyTexture.js";

/**
 * Parser for the <texture> node
 */
export class TextureParser {
    /**
     * Parse the <texture> node
     * @param {element} node - Node that should be parsed 
     * @param {CGFXMLreader} reader - XMLreader
     * @param {CGFscene} scene - CGFscene
     * @returns ParserResult containing an object with the parsed texture and errors that occurred while parsing
     */
    static parse(node, reader, scene) {
        if (node.nodeName !== "texture") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        const id = reader.getString(node, "id");
        if (id == null) {
            return ParserResult.fromError("no ID defined for texture");
        }

        let fileUrl = reader.getString(node, 'file');
        if (fileUrl == null) {
            return ParserResult.fromError("no file defined for texture with ID = " + id);
        }

        return ParserResult.fromValue(MyTexture.instantiate(id, 1, 1, scene, fileUrl));
    }
}
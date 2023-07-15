import { ParserResult } from "../ParserResult.js";
import { ComponentNode } from "../../models/graph/ComponentNode.js";
import { PickableComponentNode } from "../../models/graph/PickableComponentNode.js";
import {ComponentTransformationParser} from "./ComponentTransformationParser.js";
import {ComponentChildrenParser} from "./ComponentChildrenParser.js";
import {ColorParser} from "../ColorParser.js";
import {MyTexture} from "../../models/wrappers/MyTexture.js";
import { MyTransformation } from "../../models/wrappers/MyTransformation.js";
import { Highlight } from "../../models/Highlight.js";
import {FloatParser} from "../FloatParser.js";
import {IntegerParser} from "../IntegerParser.js";

/**
 * Parser for the <component> node
 */
export class ComponentParser {
    /**
     * Parse a single <component> node
     * @param {Component element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @param {SceneData} sceneData - Scene data
     * @returns {ParserResult} - Containing the parsed MyComponent and errors that occurred while parsing
     */	
    static parse(node, reader, sceneData) {
        if (node.nodeName != "component") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        let id = reader.getString(node, "id");
        if (id == null) {
            return ParserResult.fromError("no ID defined for component");
        }

        const children = node.children;
        let nodeNames = [];
        for (let j = 0; j < children.length; j++) {
            nodeNames.push(children[j].nodeName);
        }
        const transformationIndex = nodeNames.indexOf("transformation");
        const materialsIndex = nodeNames.indexOf("materials");
        const textureIndex = nodeNames.indexOf("texture");
        const childrenIndex = nodeNames.indexOf("children");
        const animationIndex = nodeNames.indexOf("animation");
        const highlightedIndex = nodeNames.indexOf("highlighted");
        const pickingIndex = nodeNames.indexOf("picking");

        let errors = [];
        let results = [];

        if(transformationIndex != -1) {
            var transformationResult = ComponentTransformationParser.parse(children[transformationIndex], reader, sceneData);
            results.push(transformationResult);
            var transformation = transformationResult.getValue();
        } else {
            errors.push("required <transformation> is missing");
            var transformation = new MyTransformation(null);
        }

        if(childrenIndex != -1) {
            var childrenResult = ComponentChildrenParser.parse(children[childrenIndex], reader);
            results.push(childrenResult);
            var componentChildren = childrenResult.getValue();
        } else {
            errors.push("required <children> is missing");
            var componentChildren = {"components": [], "primitives": []};
        }

        if(materialsIndex != -1) {
            var materialsResult = this.parseMaterial(children[materialsIndex], reader, sceneData);
            results.push(materialsResult);
            var materials = materialsResult.getValue();
        } else {
            errors.push("required <materials> is missing");
            var materials = ["inherit"];
        }

        if (textureIndex != -1) {
            var textureResult = this.parseTexture(children[textureIndex], reader, sceneData);
            results.push(textureResult);
            var texture = textureResult.getValueOrDefault("none");
        } else {
            errors.push("required <texture> is missing");
            var texture = "none";
        }

        if (highlightedIndex != -1) {
            var highlightedResult = this.parseHighlight(children[highlightedIndex], reader);
            results.push(highlightedResult);
            var highlighted = highlightedResult.getValue();
        }

        if (animationIndex != -1) {
            var animationResult = this.parseAnimation(children[animationIndex], reader, sceneData);
            results.push(animationResult);
            var animation = animationResult.getValue();
        }

        if (pickingIndex != -1) {
            var pickingResult = this.parsePicking(children[pickingIndex], reader, sceneData);
            results.push(pickingResult);
            var pickingId = pickingResult.getValue();
        }

        let componentNode = new ComponentNode(
            id,
            transformation,
            materials,
            texture,
            componentChildren["components"],
            componentChildren["primitives"],
            highlighted,
            animation
        );

        if (pickingId) {
            componentNode.pickingId = pickingId;
            componentNode.pickingObject = componentNode.getId();
        }

        return ParserResult.collect(
            componentNode,
            results,
            "parsing <component> with id=" + id,
            errors
        );
    }

    /**
     * Parse the <texture> node within an <element> node
     * @param {texture element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @param {SceneData} sceneData - Scene data
     * @returns {ParserResult} - Containing the parsed MyTexture (or "inherit"/"none") and errors that occurred while parsing
     */
    static parseTexture(node, reader, sceneData) {
        if (node.nodeName !== "texture") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        // Get id of the current texture.
        const id = reader.getString(node, 'id');
        if (id == null) {
            return ParserResult.fromError("no ID defined for texture");
        }

        if(id === "inherit" || id === "none") {
            return ParserResult.fromValue(id);
        }

        // Check if texture exists
        if (sceneData.textures[id] == null) {
            return ParserResult.fromError("texture with id=" + id + " does not exist");
        }

        const length_sResult = FloatParser.parse(node, reader, 'length_s', 0);
        const length_s = length_sResult.getValueOrDefault(1);

        const length_tResult = FloatParser.parse(node, reader, 'length_t', 0);
        const length_t = length_tResult.getValueOrDefault(1);

        const referenceTexture = sceneData.textures[id];
        return ParserResult.collect(
                new MyTexture(referenceTexture.getId(), referenceTexture.getCGFTexture(), length_s, length_t),
                [length_sResult, length_tResult],
                "parsing <texture> with id=" + id
        );
    }

    /**
     * Parse the <materials> node within an <element> node
     * @param {materials element} node - Node that should be parsed
     * @param {CGFXMLreader} reader - XMLreader
     * @param {SceneData} sceneData - Scene data
     * @returns {ParserResult} - Containing the parsed materials (or "inherit") and errors that occurred while parsing
     */
    static parseMaterial(node, reader, sceneData) {
        let materials = [];
        let errors = []
        for(const child of node.children) {
            if(child.nodeName !== "material"){
                errors.push("Unexpected tag <" + child.nodeName + ">");
                continue;
            }
            const id = reader.getString(child, "id");
            if(id != null){
                if(sceneData.materials[id] != null) {
                    materials.push(sceneData.materials[id]);
                } else if(id === "inherit") {
                    materials.push(id);
                } else {
                    errors.push("material with id=" + id + " does not exist");
                }
            } else {
                errors.push("missing id on <material>");
            }
        }

        if(materials.length === 0) {
            materials.push("inherit");
            errors.push("component has no material defined, defaulting to inherit");
        }

        return new ParserResult(materials, errors);
    }

    static parseHighlight(node, reader, sceneData) {
        let colorResult = ColorParser.parse(node, reader, 1.0);
        let scaleResult = FloatParser.parse(node, reader, 'scale_h');

        return ParserResult.collect(
            new Highlight(colorResult.getValue(), scaleResult.getValue()), 
            [colorResult, scaleResult], 
            "parsing <highlight>"
        );
    }

    static parseAnimation(node, reader, sceneData) {
        if (node.nodeName !== "animation") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        // Get id of the current texture.
        const id = reader.getString(node, 'id');
        if (id == null) {
            return ParserResult.fromError("no ID defined for animation");
        }

        // Check if texture exists
        if (sceneData.animations[id] == null) {
            return ParserResult.fromError("animation with id=" + id + " does not exist");
        }

        return ParserResult.fromValue(sceneData.animations[id]);
    }

    static parsePicking(node, reader, sceneData) {
        if (node.nodeName !== "picking") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        // Get id of the current texture.
        const id = reader.getString(node, 'id');
        if (id == null) {
            return ParserResult.fromError("no ID defined for picking");
        }

        const idInteger = IntegerParser.parse(node, reader, "id");
        return ParserResult.fromValue(idInteger.getValue());
    }
}
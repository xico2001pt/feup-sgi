import { ParserResult } from "../ParserResult.js";
import { MyKeyframeAnimation } from "../../models/MyKeyframeAnimation.js";
import { KeyframeParser } from "./KeyframeParser.js";

/**
 * Class for parsing keyframe animations.
 */
export class KeyframeAnimationParser {
    static parse(node, reader, scene) {
        if (node.nodeName !== "keyframeanim") {
            return ParserResult.fromError("unknown tag <" + node.nodeName + ">");
        }

        const id = reader.getString(node, "id");
        if (id == null) {
            return ParserResult.fromError("no ID defined for keyframeanim");
        }

        const children = node.children;
        let results = [];
        let keyframes = [];
        let errors = [];
        for(const child of children){
            const keyframeResult = KeyframeParser.parse(child, reader, scene);
            results.push(keyframeResult);
            if (!keyframeResult.hasError()) {
                keyframes.push(keyframeResult.getValue());
            } else {
                errors.push(keyframeResult.getErrors());
            }
        }

        let sortedKeyframes = keyframes.slice();
        sortedKeyframes.sort((k1, k2) => {
            return k1.instant > k2.instant;
        });

        if (!this.arraysEqual(keyframes, sortedKeyframes)) {
            errors.push("keyframe animation with id=" + id + " is not ordered");
        }

        return new ParserResult(new MyKeyframeAnimation(id, sortedKeyframes), errors);
    }

    static arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }
}
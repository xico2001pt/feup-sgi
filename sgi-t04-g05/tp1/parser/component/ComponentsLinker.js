/**
 * Class responsible for linking components references
 */
export class ComponentsLinker {
    /**
     * Links the components references in the given SceneData
     * @param {SceneData} sceneData - Reference to the SceneData
     * @returns List of errors
     */
    static link(sceneData){
        let errors = [];
        for(const [componentId, component] of Object.entries(sceneData.components)) {
            let children = [];
            for(const id of component.childComponentsId) {
                if(sceneData.components[id] != null){
                    children.push(sceneData.components[id]);
                } else {
                    errors.push("Component with id=" + id + " does not exists (Used in componente with id=" + componentId + ")");
                }

            }
            for(const id of component.childPrimitivesId) {
                if(sceneData.primitives[id] != null){
                    children.push(sceneData.primitives[id]);
                }else {
                    errors.push("Primitive with id=" + id + " does not exists (Used in componente with id=" + componentId + ")");
                }
            }
            component.setChildren(children);
            component.childComponentsId = null; // Free unecessary memory usage
            component.childPrimitivesId = null;
        }
        return errors;
    }
}
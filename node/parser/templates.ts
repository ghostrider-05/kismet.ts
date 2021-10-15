export const actions = (node: {
    name: string,
    archetype: string,
    links: Record<string, string[]>
}): string => `
import { SequenceAction } from "../../structures/Sequence/index.js";
import { BaseKismetActionRequiredOptions } from "../../types/index.js";

export class ${node.name} extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 1,
            ObjectArchetype: ${node.archetype},
            ParentSequence: "Sequence'Main_Sequence'",
            inputs: ${JSON.stringify(node.links, null, 4)},
            Draw: {
                width: 0,
                height: 0,
                inputOffset: 0
            }
        })
    }
}
                `
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SetVariable extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetSequenceVariable'Engine.Default__SeqAct_SetSequenceVariable'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
}
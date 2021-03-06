/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class AbortMove extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AIAbortMoveToActor'Engine.Default__SeqAct_AIAbortMoveToActor'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
}
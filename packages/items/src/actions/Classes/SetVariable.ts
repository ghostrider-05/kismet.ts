import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetVariable extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetSequenceVariable'Engine.Default__SeqAct_SetSequenceVariable'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
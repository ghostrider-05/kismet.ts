import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class FlyThroughHasEnded extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_FlyThroughHasEnded'Engine.Default__SeqAct_FlyThroughHasEnded'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
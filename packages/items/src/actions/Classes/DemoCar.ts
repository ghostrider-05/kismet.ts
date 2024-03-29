import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class DemoCar extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_DemoCar_TA'TAGame.Default__SeqAct_DemoCar_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
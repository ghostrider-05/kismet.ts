import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AssignController extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_AssignController'Engine.Default__SeqAct_AssignController'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        ControllerClass:'ControllerClass'
    }
}
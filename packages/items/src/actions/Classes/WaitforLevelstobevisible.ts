import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class WaitforLevelstobevisible extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_WaitForLevelsVisible'Engine.Default__SeqAct_WaitForLevelsVisible'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Wait\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [
                    "(Links=none,LinkDesc=\"Finished\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            }
        })
    }
    static Variables = {
        LevelNames:'LevelNames',
        bShouldBlockOnLoad:'bShouldBlockOnLoad'
    }
}
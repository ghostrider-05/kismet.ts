import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class MobileInputTouchActor extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_MobileTouch'Engine.Default__SeqEvent_MobileTouch'",
            inputs: {
                "input": [],
                "output": [
                    "(Links=none,LinkDesc=\"Tap\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            },
            ...options
        })
    }
}
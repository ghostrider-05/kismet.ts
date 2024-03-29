import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class PlayFaceFXAnim extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_PlayFaceFXAnim'Engine.Default__SeqAct_PlayFaceFXAnim'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Play\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        FaceFXAnimSetRef:'FaceFXAnimSetRef',
        FaceFXGroupName:'FaceFXGroupName',
        FaceFXAnimName:'FaceFXAnimName',
        SoundCueToPlay:'SoundCueToPlay',
        AkEventToPlay:'AkEventToPlay'
    }
}
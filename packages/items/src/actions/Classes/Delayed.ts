import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class Delayed extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_DelaySwitch'Engine.Default__SeqAct_DelaySwitch'",
            inputs: {
                "input": [],
                "output": [
                    "(Links=none,LinkDesc=\"Link 1\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(Links=none,LinkDesc=\"Aborted\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": [
                    "(ExpectedType=class'SeqVar_Float',LinkedVariables=none,LinkDesc=\"Delay\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_Int',LinkedVariables=none,LinkDesc=\"Active Link\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=0,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        LinkCount:'LinkCount',
        CurrentIdx:'CurrentIdx',
        SwitchDelay:'SwitchDelay',
        NextLinkTime:'NextLinkTime'
    }
}
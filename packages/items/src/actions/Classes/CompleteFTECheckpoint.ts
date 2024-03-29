import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CompleteFTECheckpoint extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_CompleteFTECheckpoint_TA'TAGame.Default__SeqAct_CompleteFTECheckpoint_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_String',LinkedVariables=none,LinkDesc=\"CheckpointName\",LinkVar=None,PropertyName=CheckpointName,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        CheckpointName:'CheckpointName'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetVectorParam extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetMatInstVectorParam'Engine.Default__SeqAct_SetMatInstVectorParam'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Vector',LinkedVariables=none,LinkDesc=\"VectorValue\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        MatInst:'MatInst',
        ParamName:'ParamName',
        VectorValue:'VectorValue'
    }
}
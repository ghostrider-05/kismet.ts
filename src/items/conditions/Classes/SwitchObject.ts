/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceCondition } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SwitchObject extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
                ObjectArchetype: "SeqCond_SwitchObject'Engine.Default__SeqCond_SwitchObject'",
                inputs: {
			    "input": [],
			    "output": [],
			    "variable": [
			        "(ExpectedType=class'SeqVar_Object',LinkedVariables=none,LinkDesc=\"Object\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ]
			}
            })
        }
            static Variables = {
    	SupportedValues:'SupportedValues'
    }
}
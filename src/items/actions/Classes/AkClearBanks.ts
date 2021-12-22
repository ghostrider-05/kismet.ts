/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class AkClearBanks extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AkClearBanks'AkAudio.Default__SeqAct_AkClearBanks'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"ClearBanks\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [],
			    "variable": []
			}
        })
    }
}
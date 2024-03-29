import { Constants } from '@kismet.ts/shared'

import type {
    SequenceAction,
    Sequence,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable,
} from '../structures/index.js'

import type {
    SequenceItemType,
    SequenceItemTypeName,
} from '../structures/index.js'

const { NodeType } = Constants

export class BaseItem {
    public readonly type: SequenceItemTypeName | null

    constructor (type?: SequenceItemTypeName) {
        this.type = type ?? null
    }

    private _checkType (compareType: Constants.NodeType) {
        return this.type === compareType
    }

    public isAction (): this is SequenceAction {
        return this._checkType(NodeType.ACTIONS)
    }

    public isCondition (): this is SequenceCondition {
        return this._checkType(NodeType.CONDITIONS)
    }

    public isEvent (): this is SequenceEvent {
        return this._checkType(NodeType.EVENTS)
    }

    public isSequence (): this is Sequence {
        return this._checkType(NodeType.SEQUENCES)
    }

    public isSequenceItem (): this is SequenceItemType {
        return this.type ? !this.isSequence() : false
    }

    public isSequenceActionNode (): this is SequenceAction | SequenceCondition {
        return this.isAction() || this.isCondition()
    }

    public isSequenceNode (): this is
        | SequenceAction
        | SequenceCondition
        | SequenceEvent {
        return this.isSequenceActionNode() || this.isEvent()
    }

    public isVariable (): this is SequenceVariable {
        return this._checkType(NodeType.VARIABLES)
    }
}

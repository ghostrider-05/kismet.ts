import { SequenceVariable } from "../../structures/Sequence/Variable.js"

import { 
    addVariable,
    boolToKismet
} from "../../shared/index.js"

import type { 
    KismetVariableOptions,
    UDKContentBrowserObject
} from "../../types/index.js"

export class ObjectVariable extends SequenceVariable {
    public value: UDKContentBrowserObject;

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Object'Engine.Default__SeqVar_Object'`,
            inputs: {}
        })

        this.value = ''
    }

    public setValue (value: UDKContentBrowserObject): this {
        this.value = value

        return this
    }

    public override toString (): string {
        const properties: [string, string][] = [
            ['ObjValue', this.value === '' ? 'None' : this.value]
        ]

        return addVariable(super.toString(), properties)
    }
}

export class ObjectListVariable extends ObjectVariable {
    public values: UDKContentBrowserObject[];

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.values = []

        this.setKismetSetting('ObjectArchetype', `SeqVar_ObjectList'Engine.Default__SeqVar_ObjectList'`)
    }

    public addItem (item: UDKContentBrowserObject): this {
        this.values.push(item)

        return this
    }

    public addItems (items: UDKContentBrowserObject[]): this {
        items.forEach(item => this.addItem(item))

        return this
    }

    public override toString (): string {
        const values: [string, string][] = this.values.map((value, i) => [`ObjList(${i})`, value])
        
        return addVariable(super.toString(), values)
    }
}

export class ObjectVolumeVariable extends ObjectVariable {
    public collidingOnly = true;
    public excludeClasses: string[] = [
        `Class'Engine.Trigger'`,
        `Class'Engine.Volume'`
    ]

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.setKismetSetting('ObjectArchetype', `SeqVar_ObjectVolume'Engine.Default__SeqVar_ObjectVolume'`)
    }

    //TODO: extract classtype from a given class
    public excludeClass (className: string, Package: string): this {
        this.excludeClasses.push(`Class'${Package}.${className}'`)

        return this
    }

    public setCollidingOnly (enabled: boolean): this {
        this.collidingOnly = enabled

        return this
    }

    public override toString (): string {
        const classList: [string, string][] = this.excludeClasses.map((Class, i) => {
            return [`ExcludeClassList(${i})`, Class]
        })
        const properties:[string, string][] = [
            ...classList,
            ['bCollidingOnly', boolToKismet(this.collidingOnly)]
        ]
        
        return addVariable(super.toString(), properties)
    }
}
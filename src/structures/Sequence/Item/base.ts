import { Sequence } from '../base.js';
import { BaseKismetConnection, ItemConnection, VariableConnection } from './link.js';

import {
    ProcessId,
    ProcessManager
} from '../../../managers/index.js'

import {
    Constants,
    boolToKismet,
    filterEmptyLines,
    mapObjectKeys,
    parseVar,
    quote
} from '../../../shared/index.js'

import type { 
    BaseKismetItemOptions,
    KismetConnectionType,
    KismetConnection,
    KismetConnections,
    BaseKismetItemDrawOptions,
    SequenceItemType,
    SequenceItemTypeName
} from '../../../types/index.js'

const { 
    KISMET_NODE_LINES,
    MAIN_SEQUENCE,
    ObjInstanceVersions
} = Constants

export class BaseSequenceItem {
    public comment: string | null;
    public supressAutoComment: boolean | null;
    public outputCommentToScreen: boolean | null;

    public connections: KismetConnections | null = null;
    public sequence: string | Sequence;

    public readonly type: SequenceItemTypeName | null
    public readonly id: ProcessId;

    private kismet: BaseKismetItemDrawOptions;

    constructor (options: BaseKismetItemOptions & { type?: SequenceItemTypeName }) {
        this.comment = null
        this.supressAutoComment = null
        this.outputCommentToScreen = null

        this.type = options.type ?? null

        try {
            this.connections = ["input", "output", "variable"].map(key => {
                const { inputs } = options;
                const links = (inputs as Record<string, string[]>)[key]

                if (!links) return {
                    key,
                    connections: []
                }

                if (links.length === 0 && ['input', 'output'].includes(key)) {
                    return {
                        key,
                        connections: this.type === 'events' && key === 'input' ? [] : [
                            new BaseKismetConnection({
                                input: key === 'input' ? 'In' : 'Out', 
                                type: key as KismetConnectionType,
                            })
                        ]
                    }
                } else return {
                    key,
                    connections: links.map(input => {
                        return BaseKismetConnection.convertLink(key as KismetConnectionType, input)
                    }).filter(n => n != undefined) as (ItemConnection | VariableConnection)[]
                }
            }).reduce((x, y) => ({ ...x, [y.key]: y.connections }), {}) as KismetConnections

        } catch (err) {
            console.log(err, this)
        }

        const [Class, defaultClass,] = options.ObjectArchetype.split("'")
        const [Package, ] = defaultClass.split('.')

        this.kismet = {
            x: 0,
            y: 0,
            class: Class,
            classType: `Class'${Package}.${Class}'`,
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: MAIN_SEQUENCE,
            ObjInstanceVersion: options.ObjInstanceVersion ?? 1,
            DrawConfig: {
                width: options.Draw?.width ?? 0,
                height: options.Draw?.height ?? null,
                maxWidth: options.Draw?.maxWidth ?? null
            }
        }

        this.id = ProcessManager.id(this.kismet.class)

        this.sequence = MAIN_SEQUENCE
    }

    private commentToKismet (): string {
        const kismet = [
            typeof this.comment === 'string' ? parseVar('ObjComment', quote(this.comment)) : '',
            this.supressAutoComment === false ? parseVar('bSuppressAutoComment', boolToKismet(this.supressAutoComment)) : '',
            this.outputCommentToScreen ? parseVar('bOutputObjCommentToScreen', boolToKismet(this.outputCommentToScreen)) : ''
        ]

        return filterEmptyLines(kismet)
    }

    private getKismetName (): string {
        const [, id] = this.id.resolveId().split('|')
        return this.kismet.ObjectArchetype.split("'")[0].concat(`_${id}`)
    }

    protected setKismetSetting<T> (type: keyof BaseKismetItemDrawOptions, value: T): this {
        this.kismet[type] = value as T as never

        if (type === 'ObjectArchetype') {
            this.kismet.class = (value as unknown as string).split('\'')[0]
        }

        return this
    }

    public get linkId (): string {
        return `${this.kismet.class}'${this.getKismetName()}'`
    }

    public equals (item: SequenceItemType): boolean {
        return item.kismet?.ObjectArchetype === this.kismet.ObjectArchetype
    }

    public getConnection (type: KismetConnectionType, connectionName: string): (BaseKismetConnection | KismetConnection) | null {
        const connections = this.connections?.[type] as BaseKismetConnection[] | undefined

        return connections?.find(c => c.name === connectionName) ?? null
    }

    public setComment ({ comment, supressAutoComment, outputCommentToScreen }: {
        comment?: string,
        supressAutoComment?: boolean,
        outputCommentToScreen?: boolean
    }): this {
        this.comment = comment ?? null
        this.supressAutoComment = supressAutoComment ?? null
        this.outputCommentToScreen = outputCommentToScreen ?? null

        return this
    }  

    public setSequence (sequence: string | Sequence): this {
        if (typeof sequence !== 'string') {
            this.sequence = sequence
            this.kismet.ParentSequence = sequence.linkId
        } else {
            this.kismet.ParentSequence = `Sequence'${sequence}'`
        }

        return this
    }

    public toKismet (): string {
        const { 
            class: Class,
            DrawConfig, 
            ObjectArchetype,
            ObjInstanceVersion, 
            ParentSequence,
            x,
            y
        } = this.kismet

        const Name = `"${this.getKismetName()}"`

        const variables = [
            ['ObjInstanceVersion', ObjInstanceVersions.get(Class) ?? ObjInstanceVersion],
            ['ParentSequence', ParentSequence],
            ['ObjPosX', x],
            ['ObjPosY', y],
            ['DrawWidth', DrawConfig.width],
            ['MaxWidth', DrawConfig.maxWidth],
            ['DrawHeight', DrawConfig.height],
            ['Name', Name],
            ['ObjectArchetype', ObjectArchetype]
        ].map(prop => parseVar(prop[0] as string, prop[1]))

        const connections = (this.connections as Record<string, BaseKismetConnection[]>) ?? {}
        const properties = mapObjectKeys(connections, (c, i) => c.toKismet(i))
            .map(c => c.join('\n'))
            .concat(this.commentToKismet(), variables)

        const node = [
            KISMET_NODE_LINES.begin(Name, Class), 
            filterEmptyLines(properties), 
            KISMET_NODE_LINES.end
        ]

        return node.join('\n')
    }
}
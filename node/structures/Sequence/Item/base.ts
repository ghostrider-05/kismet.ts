import { Sequence } from '../base.js';
import { KismetConnection } from './link.js';

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
    KismetConnections,
    BaseKismetItemDrawOptions,
    SequenceItemType
} from '../../../types/index.js'

const { 
    KISMET_NODE_LINES,
    MAIN_SEQUENCE
} = Constants

export class BaseSequenceItem {
    public comment: string | null;
    public supressAutoComment: boolean | null;
    public outputCommentToScreen: boolean | null;

    public connections: KismetConnections;
    public sequence: string | Sequence;

    private kismet: BaseKismetItemDrawOptions;

    constructor (options: BaseKismetItemOptions) {
        this.comment = null
        this.supressAutoComment = null
        this.outputCommentToScreen = null

        this.connections = ["input", "output", "variable"].map(key => {
            const { inputs } = options;

            return {
                key,
                connections: (inputs as Record<string, string[]>)[key]?.map(keys => {
                    return new KismetConnection(keys, key as KismetConnectionType)
                }) ?? []
            }
        }).reduce((x, y) => ({ ...x, [y.key]: y.connections }), {}) as KismetConnections

        this.kismet = {
            x: 0,
            y: 0,
            class: options.ObjectArchetype.split("'")[0],
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: MAIN_SEQUENCE,
            ObjInstanceVersion: options.ObjInstanceVersion ?? 1,
            nameId: 0,
            DrawConfig: {
                width: options.Draw?.width ?? 0,
                height: options.Draw?.height ?? null,
                maxWidth: options.Draw?.maxWidth ?? null
            }
        }

        this.sequence = MAIN_SEQUENCE

        // if (!this.kismet.DrawConfig.height && !this.kismet.DrawConfig.maxWidth) throw new Error()
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
        return this.kismet.ObjectArchetype.split("'")[0].concat(`_${this.kismet.nameId}`)
    }

    protected setKismetSetting<T> (type: keyof BaseKismetItemDrawOptions, value: T): this {
        this.kismet[type] = value as T as never

        return this
    }

    public get linkId (): string {
        return `${this.kismet.class}'${this.getKismetName()}'`
    }

    public equals (item: SequenceItemType): boolean {
        return item.kismet?.ObjectArchetype === this.kismet.ObjectArchetype
    }

    public getConnection (type: KismetConnectionType, connectionName: string): KismetConnection | null {
        return this.connections[type]?.find(c => c.name === connectionName) ?? null
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
            ['ObjInstanceVersion', ObjInstanceVersion],
            ['ParentSequence', ParentSequence],
            ['ObjPosX', x],
            ['ObjPosY', y],
            ['DrawWidth', DrawConfig.width],
            ['MaxWidth', DrawConfig.maxWidth],
            ['DrawHeight', DrawConfig.height],
            ['Name', Name],
            ['ObjectArchetype', ObjectArchetype]
        ].map(prop => parseVar(prop[0] as string, prop[1]))

        const properties = mapObjectKeys(this.connections, (c, i) => c.toKismet(i))
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

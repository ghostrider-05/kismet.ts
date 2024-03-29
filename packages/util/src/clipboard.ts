/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clipboardy from 'clipboardy'
import type { Sequence, SequenceItemType } from '@kismet.ts/core'

export class ClipboardUtil {
    public static async read (): Promise<string> {
        return await clipboardy.read()
    }

    public static async write (input: string): Promise<void> {
        return await clipboardy.write(input)
    }
}

export interface IKismetCopyQueue<T> {
    stack: T[][]
    current: number
    next?: () => void
    copy: () => Promise<void>
}

function chunk <I> (items: I[], size: number): I[][] {
    return Array.from(
        { length: Math.ceil(items.length / size) }, 
        (_, i) => items.slice(i * size, i * size + size)
    );
}

export class KismetLimitedClipboard {
    public max: number;
    public connectItems: boolean;

    constructor (max: number, connectItems?: boolean) {
        this.max = max;
        this.connectItems = connectItems ?? true;

        if (max < 1) throw new Error();
    }

    private createQueue <T> (groups: T[][]): IKismetCopyQueue<T> {
        return {
            stack: groups,
            current: 0,
            copy () {
                return ClipboardUtil.write(this.stack[this.current].join('\n'))
            },
            next () {
                if (this.current + 1 === this.stack.length) {
                    this.current = 0
                    this.stack = []
                    this.next = undefined
                    return
                }

                this.current += 1
            }
        }
    }

    public createLinkedMap (sequence: Sequence): Map<string, string[]> {
        const map = new Map<string, string[]>();

        sequence.items.forEach(item => {
            if (!map.has(item.linkId)) {
                const ids = sequence.util.listConnectedItems(item.linkId)
                map.set(item.linkId, ids)
            }
        })

        return map
    }

    public start (sequence: Sequence): IKismetCopyQueue<SequenceItemType> {
        if (!this.connectItems) {
            const items = <SequenceItemType[]>sequence.items.filter(x => !x.isSequence())
            return this.createQueue(chunk(items, this.max))
        } else {
            const ids = new Set<string>()
            const groups: SequenceItemType[][] = []
            const map = this.createLinkedMap(sequence), keys = [...map.keys()]
            let index = 0, keyIndex = 0

            while (index < map.size) {
                groups[index] ??= []
                const length = groups[index].length

                while ((length + map.get(keys[keyIndex])!.length) < this.max && keyIndex < keys.length) {
                    const batch = sequence.items.filter(i => map.get(keys[keyIndex])?.some(x => x === i.linkId) ?? false)

                    groups[index].push(...<SequenceItemType[]>batch)
                    batch.forEach(b => ids.add(b.linkId))
                    keyIndex += 1
                }

                index += 1;
            }

            return this.createQueue(groups)
        }
    }
}

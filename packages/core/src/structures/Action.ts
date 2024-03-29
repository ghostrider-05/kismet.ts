import { Constants, KismetError } from '@kismet.ts/shared'

import {
    BaseKismetConnection,
    BaseKismetItemOptions,
    KismetConnection,
    ItemConnection,
    SequenceNode,
} from '../item/index.js'

import type { KismetActionRequiredOptions } from './options.js'

const { NodeType, ConnectionType } = Constants

export class SequenceAction extends SequenceNode {
    constructor (
        options: KismetActionRequiredOptions &
            BaseKismetItemOptions & { isCondition?: boolean }
    ) {
        super({
            ...options,
            type: options.isCondition ? NodeType.CONDITIONS : NodeType.ACTIONS,
        })
    }

    private _validateConnection (
        fromConnection: KismetConnection | BaseKismetConnection | null,
        toConnection: KismetConnection,
        names: string[]
    ) {
        if (fromConnection && toConnection) {
            return true
        } else {
            const nameIndex = !fromConnection ? 0 : 1

            throw new KismetError('UNKNOWN_CONNECTION', [
                names[nameIndex],
                this.ClassData.Class,
                nameIndex ? 'input' : 'output',
            ])
        }
    }

    /**
     * Adds a new output connection
     * @param from Data from this node
     * @param to The node to connect to
     */
    public addOutputConnection (
        from: { name: string },
        to: { name: string; item: SequenceNode }
    ): this {
        const { name: outputName } = from,
            { item, name: inputName } = to

        const connection = this.getConnection(ConnectionType.OUTPUT, outputName)
        const itemConnection = item.getConnection(
            ConnectionType.INPUT,
            inputName
        ) as ItemConnection

        if (
            this._validateConnection(connection, itemConnection, [
                outputName,
                inputName,
            ])
        ) {
            this.connections?.output
                .find(n => n.name === outputName)
                ?.addLink(
                    item.linkId,
                    item.connections?.input.indexOf(itemConnection)
                )
        }

        return this
    }

    /**
     * Set the targets for this node
     * @param objects The object references to the targets
     */
    public setTargets (objects: string[]): this {
        objects.forEach((object, i) => {
            this.setVariable(`Targets(${i})`, object)
        })

        return this
    }
}

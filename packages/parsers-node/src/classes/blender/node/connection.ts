import { KismetConnectionType } from '@kismet.ts/core'
import { Constants, indent, KismetError, quote } from '@kismet.ts/shared'

import {
    UnrealJsonReadFileNode,
    UnrealJsonReadFile,
} from '../../extractor/files.js'
import { linkIcon } from './icon.js'
import { variableBlenderType } from './variable.js'

const { ConnectionType, NodeType } = Constants

const defaultKeyValue = (key: string) => {
    const name =
        key === Constants.ConnectionType.INPUT
            ? Constants.DefaultConnectionName.IN
            : Constants.DefaultConnectionName.OUT

    return [{ name: `"${name}"` }]
}

const getKeyValue = (key: string, type: string, links?: { name: string }[]) => {
    if (
        type === NodeType.VARIABLES ||
        (type === NodeType.EVENTS && key === ConnectionType.INPUT)
    )
        return []
    if ((links?.length ?? 0) > 0) return undefined

    if (type === NodeType.EVENTS && key === ConnectionType.VARIABLE)
        return [
            {
                name: `"Instigator"`,
            },
        ]

    if (
        (<string[]>[NodeType.ACTIONS, NodeType.CONDITIONS]).includes(type) &&
        key === ConnectionType.VARIABLE
    )
        return [
            {
                name: `"Target"`,
            },
        ]

    return defaultKeyValue(key)
}

const getConnections = (
    node: UnrealJsonReadFileNode
): UnrealJsonReadFileNode['links'] => {
    if (node.type === Constants.NodeType.VARIABLES)
        return {
            variable: [{ name: 'Out' }],
            input: [],
            output: [],
        }

    return Object.keys(node.links)
        .map(key => {
            return {
                [key]:
                    getKeyValue(
                        key,
                        node.type,
                        node.links[key as KismetConnectionType]
                    ) ?? node.links[key as KismetConnectionType],
            }
        })
        .reduce(
            (prev, curr) => ({
                ...prev,
                ...curr,
            }),
            {}
        ) as UnrealJsonReadFileNode['links']
}

const nodeSocketName = (name: string) =>
    `${name
        .trim()
        .replaceAll(/"| /g, '')
        .replaceAll(/\(|\)|-/g, '_')
        .replaceAll(/</g, '0')
        .replaceAll(/=/g, '1')
        .replaceAll(/>/g, '2')
        .replaceAll(/!/g, '3')}Socket`

export const formatConnections = (
    node: UnrealJsonReadFileNode,
    classes: Partial<UnrealJsonReadFile>[]
) => {
    const connections = getConnections(node)

    if (
        Object.keys(connections).every(key => {
            return connections[key as KismetConnectionType].length === 0
        })
    ) {
        return `        print('No connections on ${node.Class}')`
    }

    return Object.keys(connections)
        .map(key => {
            let prefix = ''

            switch (key) {
                case ConnectionType.INPUT:
                    prefix = 'self.inputs'
                    break
                case ConnectionType.VARIABLE:
                    if (node.type !== NodeType.EVENTS) prefix = 'self.inputs'
                    else prefix = 'self.outputs'
                    break
                case ConnectionType.OUTPUT:
                    prefix = 'self.outputs'
                    break
                default:
                    new KismetError('INVALID_TYPE')
            }

            return connections[key as KismetConnectionType]
                .map(connection => {
                    if (node.name === `"Instigator"` && node.type !== 'events')
                        return ''
                    const finalPrefix =
                        connection.name === `"Instigator"` ||
                        node.type === Constants.NodeType.VARIABLES
                            ? 'self.outputs'
                            : prefix
                    const socketName = nodeSocketName(connection.name)

                    return `${indent(2)}${socketName} = ${finalPrefix}.new('${
                        finalPrefix === 'self.inputs' ? 'MultiSocketInput' :  variableBlenderType(classes, connection.expectedType)
                            .socket
                    }', ${
                        node.type === Constants.NodeType.VARIABLES
                            ? quote(connection.name)
                            : connection.name
                    })\n${indent(2)}${socketName}.display_shape = '${linkIcon(
                        key
                    )}'\n${finalPrefix === 'self.inputs' ? `${indent(2)}${socketName}.hide_value = hide_variable_values\n` : ''}`
                })
                .join('\n')
        })
        .join('\n\n')
}

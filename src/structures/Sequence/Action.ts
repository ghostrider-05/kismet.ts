import { SequenceNode, ItemConnection } from './Item/index.js'

import type { 
    BaseKismetItemOptions,
    KismetActionRequiredOptions 
} from '../../types/index.js'

export class SequenceAction extends SequenceNode {

    constructor (options: KismetActionRequiredOptions & BaseKismetItemOptions) {
        super({ ...options, type: 'actions' })
    } 

    public addConnection (item: SequenceAction, outputName: string, inputName: string): this {
        const connection = this.getConnection('output', outputName);
        const itemConnection = item.getConnection('input', inputName) as ItemConnection;
        
        if (connection && itemConnection) {
            this.connections?.output.find(n => n.name === outputName)?.addLink(
                item.linkId, 
                item.connections?.input.indexOf(itemConnection)
            )
        } else if (!connection) {
            console.warn(`Could not find output connection for '${outputName}' on ${this['kismet']['class']}`)
        } else {
            console.warn(`Could not find input connection for '${inputName}' on ${item['kismet']['class']}`)
        }

        return this
    }

    public setTargets (objects: string[]): this {
        objects.forEach((object, i) => {
            this.setVariable(`Targets(${i})`, object)
        })

        return this
    }
}
import { KismetFile, Util } from '../src/index.js'
import { ProcessManager } from '../src/structures/index.js'
import { builders } from '../src/structures/builders/index.js'

// Keep old clipboard value from before tests
let clipboardValue = ''

beforeAll(async () => {
    clipboardValue = await Util.clipboard.read()
})

afterAll(async () => await Util.clipboard.write(clipboardValue))

describe('main project', () => {
    const baseProject = new KismetFile({ projectName: 'test' })

    test('constructor options', () => {
        expect(baseProject.projectName).toBe('test')
    })

    test('debug options', () => {
        expect(ProcessManager.processes['test_1']).toBeUndefined()

        new KismetFile({ projectName: 'test_1', debug: true })
        expect(ProcessManager.processes['test_1'].options.debug).toBe(true)
    })

    test('list project items', () => {
        const items = {
            Actions: [
                builders.actionBuilder(),
                builders.actionBuilder(),
                builders.actionBuilder()
            ],
            Events: [builders.eventBuilder()]
        }

        expect(KismetFile.listItems(items)).toEqual([
            ...items.Actions,
            ...items.Events
        ])
    })

    test('project export options', () => {
        expect(baseProject.toString()).toEqual('')

        const action = builders.actionBuilder()
        baseProject.mainSequence.addItem(action)

        expect(baseProject.toString()).toEqual(action.toString())
    })

    test('item copy to clipboard', async () => {
        const action = builders.actionBuilder()

        return KismetFile.copy(action).then(async () => {
            return Util.clipboard.read().then(content => {
                expect(content).toEqual(action.toString())
            })
        })
    })

    test('project copy to clipboard', async () => {
        return baseProject.copyKismet().then(async () => {
            return Util.clipboard.read().then(content => {
                expect(content).toEqual(baseProject.toString())
            })
        })
    })
})
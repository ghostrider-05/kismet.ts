import * as fs from 'fs'

import { readNodeFile } from '../extractor/read.js'
import { _validateNodeInput, _validatePackage } from './validate.js'
import { writeNode, writePackages } from './write.js'

import type {
    ExportOptions,
    JsonFile,
    PathInput,
    RawUnrealJsonFile,
    UnrealJsonReadFile,
    UnrealJsonReadFileNode,
} from '../extractor/files.js'

interface NodeReadOptions {
    debug: boolean
    name: string
    path: string
    Package: string
    exportPath: string
    classes: Record<string, JsonFile[]>
}

function readNode (options: NodeReadOptions) {
    const { Package, path, exportPath } = options

    const fileContent = fs.readFileSync(path, 'utf-8')
    const fileJSON = JSON.parse(fileContent) as RawUnrealJsonFile

    if (!_validateNodeInput(fileJSON)) return

    const node = readNodeFile(fileJSON, Package)

    if (options.classes[node.type]?.some(n => n.name === node.name)) {
        return
    }

    return {
        nodePath: exportPath.concat(`/${node.type}/Classes/${node.name}.ts`),
        node,
    }
}

async function readPackage (
    name: string,
    paths: PathInput,
    options: ExportOptions,
    classes: Record<string, JsonFile[]>
) {
    const { kismetNodes, path } =
        _validatePackage(name, paths, options.classes ?? false) ?? {}
    if (!kismetNodes) return
    const items = [],
        externalClasses: Partial<UnrealJsonReadFile>[] = []

    for await (const file of kismetNodes) {
        const kismetNode = readNode({
            Package: name,
            path: path + '\\' + file,
            debug: options.debug ?? false,
            name: file,
            ...paths,
            classes,
        })
        if (!kismetNode) continue
        if (!externalClasses.some(x => x.Class === kismetNode.node.Class)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { staticProperties, links, type, category, ...nodeClass } =
                kismetNode.node
            externalClasses.push(nodeClass)

            if (<string>kismetNode.node.type === '') {
                continue
            }
        }

        const { node, nodePath } = kismetNode
        const { jsonNode, Class } =
            (await writeNode(node, {
                path: nodePath,
                json: options.json || options.blender,
                Package: name,
                version: options.classVersion
            })) ?? {}

        items.push({
            jsonNode,
            Class,
        })
    }

    return { items, externalClasses }
}

export function getSuperClasses (
    name: string, 
    items: (RawUnrealJsonFile | Partial<UnrealJsonReadFile> | UnrealJsonReadFileNode)[],
) {
    const key = 'extends' in items[0] ? 'extends' : 'Extends'
    const Extends = items.find(i => i.name === name)?.[<never>key]
    const Classes = [name]
    let latests: string | undefined = Extends

    const isExtending = (name?: string) =>
        name != undefined && name !== 'Object'
    const extendingClasses = (list: string[]) =>
        list.concat(latests ? [latests] : [])

    if (!isExtending(Extends)) return extendingClasses(Classes)

    while (isExtending(latests)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Classes.push(latests!)

        latests = items.find(i => i.name === latests)?.[<never>key]
    }

    return extendingClasses(Classes)
}

export function isPlaceableClass (
    name: string,
    items: Partial<UnrealJsonReadFile>[]
) {
    return getSuperClasses(name, items).some(
        n => items.find(i => i.name === n)?.placeable
    )
}

//Internal wrapper for reading / writing packages
export class ClassManager {
    public collectedClasses: Record<string, JsonFile[]> = {
        actions: [],
        events: [],
        conditions: [],
        variables: [],
    }
    public json: UnrealJsonReadFileNode[] = []
    public externalClasses: Partial<UnrealJsonReadFile>[] = []
    public options?: ExportOptions = undefined

    constructor (options: ExportOptions) {
        this.options = options
    }

    public setOptions (options: ExportOptions): this {
        this.options = options

        return this
    }

    public async readPackage ({
        name,
        paths,
    }: {
        name: string
        paths: PathInput
    }) {
        const Package = await readPackage(
            name,
            paths,
            this.options ?? {},
            this.collectedClasses
        )
        if (!Package) return
        const { items, externalClasses } = Package
        this.externalClasses.push(...externalClasses)

        items
            .filter(n => n.Class)
            .forEach(item => {
                if (
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    !this.collectedClasses[item.Class!.type].some(
                        i => i.name === item.Class?.name
                    )
                ) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.collectedClasses[item.Class!.type].push(item.Class!)
                }

                if (item.jsonNode) {
                    this.json.push(item.jsonNode)
                }
            })
    }

    public async writePackages (exportPath: string) {
        return await writePackages({
            exportPath,
            externalClasses: this.externalClasses,
            classes: this.collectedClasses,
            json: this.options?.json || this.options?.blender ? this.json : [],
            blenderOptions: this.options?.blenderOptions,
            groupItems: this.options?.groupItems ?? false,
            blender: this.options?.blender ?? false,
            writeIndexFile: this.options?.writeIndexFile ?? true,
            version: this.options?.version ?? null,
            isMainFolder: exportPath === './src/items/',
        })
    }
}

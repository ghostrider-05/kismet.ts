import * as fs from 'fs'

import type { LocalClassesCreateOptions } from './files.js'

import { _validatePaths, _validateSubPaths } from '../utils/validate.js'

import { _defaultExportOptions } from '../utils/options.js'
import { ClassManager } from '../utils/ClassManager.js'

export async function createLocalClasses (inputOptions: LocalClassesCreateOptions): Promise<true | undefined> {
    const { importPath, exportPath } = inputOptions
    const options = _defaultExportOptions(inputOptions)
    const manager = new ClassManager().setOptions(options)

    await _validateSubPaths(exportPath, options.types)
    if (!_validatePaths(inputOptions)) return

    for await (const Package of fs.readdirSync(importPath)) {
        await manager.readPackage({ name: Package, paths: inputOptions })
    }

    // Generate export files to export all the classes
    await manager.writePackages(exportPath)
    return true
}

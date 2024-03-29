import { Constants } from '@kismet.ts/shared'

import type {
    SequenceAction,
    SequenceCondition,
} from '../structures/index.js'

import type { ProcessId } from '../managers/index.js'

import type { KismetObjectCommentOptions } from '../item/index.js'

// import { PositionStyleOption, VariablePositionStyleOption } from './enums.js'

/**
 * Options for layouts
 *
 * - none: set no position
 * - grid: place all nodes in a grid. To have custom control over the grid placements, use Item#setPosition
 * - waterfall: place the next object in the sequence right and below the current object
 * - mountain: place the next object in the sequence right and above the current object
 * - schema: apply the options in the given schema
 *
 * @default 'none'
 */
export type PositionStyleOptions = Constants.PositionStyleOption

/**
 * Position options for variables
 *
 * - inherit: set default positions
 * - global: set all variables in global box
 * - attach: place variables close to the first connected item
 * - schema: apply the options in the given schema
 *
 * @default 'inherit'
 */
export type VariablePositionStyleOptions = Constants.VariablePositionStyleOption

export interface layoutOptions {
    startX?: number
    startY?: number
    spaceBetween?: number
}

/**
 * Options for creating a new kismet sequence for a project
 *
 * @param projectName - The name of the project
 * @param layout - Default position options for sequences in the project
 */
export interface projectOptions<S> {
    projectName: string
    debug?: boolean
    layout?: SequencePositionOptions<S>
}

export interface SequenceSchemaVariableOptions {
    style: Omit<VariablePositionStyleOptions, 'schema' | 'none'>
    itemClass?: string
    globalOptions?: {
        bounds: [number, number, number, number]
    }
}

export interface SequenceSchemaOptions<T> {
    event?: {
        id: string
        connectionName?: string
    }
    layout: {
        type?: T
        style: Omit<PositionStyleOptions, 'schema' | 'none'>
        variables?: SequenceSchemaVariableOptions[]
        options: Required<layoutOptions>
    }[]
}

export interface SequencePositionManagerOptions<S> {
    layoutOptions: Required<layoutOptions>
    projectId?: ProcessId
    style?: PositionStyleOptions
    schema?: SequenceSchemaOptions<S>[]
}

export type SequencePositionOptions<S> = Omit<
    SequencePositionManagerOptions<S>,
    'layoutOptions'
> & {
    position?: Required<layoutOptions>
}

export interface SequenceViewOptions {
    x?: number
    y?: number
    zoom?: number
}

export interface SequenceBaseConstructorOptions<S> {
    layout?: SequencePositionOptions<S>
    name?: string
    mainSequence?: boolean
    index?: number
    project?: ProcessId
    defaultView?: Required<SequenceViewOptions>
}

export type SequenceOptions<T, S> = Omit<
    SequenceBaseConstructorOptions<S>,
    | 'mainSequence'
    | 'index'
> & {
    objects?: T[]
    name: string
}

export interface BaseKismetEventOptions {
    maxTriggerCount?: number
    triggerDelay?: number
    enabled?: boolean
    playerOnly?: boolean
    clientSideOnly?: boolean
}

export interface BaseKismetVariableOptions {
    name?: string
}

export interface BaseKismetActionOptions {
    next?: SequenceAction | SequenceCondition
}

export type KismetEventOptions<T extends {} = {}> = T & BaseKismetEventOptions

export type KismetVariableOptions<T extends {} = {}> = T &
    BaseKismetVariableOptions

export type BaseKismetActionRequiredOptions<T extends {} = {}> = T &
    BaseKismetActionOptions

export type KismetActionRequiredOptions<T extends {} = {}> =
    BaseKismetActionRequiredOptions<T> & KismetObjectCommentOptions

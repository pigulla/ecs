import type { ReadonlyDeep } from 'type-fest'

import type { IWorld } from '../../world.interface'

export type Dimensions = ReadonlyDeep<{
    world: IWorld
    width: number
    height: number
    totalWidth: number
    totalHeight: number
    cellSizePx: number
    gridOffsetPx: number
}>

import type { ReadonlyDeep } from 'type-fest'

import type { IReadonlyWorld } from '../../../ecs'

export type Dimensions = ReadonlyDeep<{
    world: IReadonlyWorld
    width: number
    height: number
    totalWidth: number
    totalHeight: number
    cellSizePx: number
    gridOffsetPx: number
}>

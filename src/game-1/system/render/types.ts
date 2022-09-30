import type { ReadonlyDeep } from 'type-fest'

export type Dimensions = ReadonlyDeep<{
    rows: number
    columns: number
    width: number
    height: number
    totalWidth: number
    totalHeight: number
    cellSizePx: number
    gridOffsetPx: number
}>

import type { IWorld } from '../../../ecs'
import type { Coordinate } from '../../../framework/geometry'
import { COLUMN, ROW } from '../../../framework/geometry'
import type { Visual } from '../../component'
import { Fact } from '../fact'

import type { Dimensions } from './types'

export function withVisual(
    ctx: CanvasRenderingContext2D,
    visual: Visual | null,
    callback: (ctx: CanvasRenderingContext2D) => void,
): void {
    ctx.save()

    if (visual) {
        if (visual.fillStyle !== null) {
            ctx.fillStyle = visual.fillStyle
        }
        if (visual.strokeStyle !== null) {
            ctx.strokeStyle = visual.strokeStyle
        }
        if (visual.lineWidth !== null) {
            ctx.lineWidth = visual.lineWidth
        }
        if (visual.lineDash !== null) {
            ctx.setLineDash(visual.lineDash as number[])
        }
    }

    callback(ctx)
    ctx.restore()
}

export function clear(
    { width, height }: Dimensions,
    ctx: CanvasRenderingContext2D,
    backgroundColor?: string,
): void {
    ctx.clearRect(0, 0, width, height)

    if (backgroundColor) {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
    }
}

export function forEachSquare(
    dimensions: Dimensions,
    callback: (coordinate: Coordinate) => void,
): void {
    for (let row = 0; row < dimensions.rows; row++) {
        for (let column = 0; column < dimensions.columns; column++) {
            callback([column, row])
        }
    }
}

export function getDimensions(
    world: IWorld<Fact>,
    { cellSizePx, gridOffsetPx }: { cellSizePx: number; gridOffsetPx: number },
): Dimensions {
    const columns = world.getFact<number>(Fact.COLUMNS)
    const rows = world.getFact<number>(Fact.ROWS)

    return {
        rows,
        columns,
        cellSizePx,
        gridOffsetPx,
        width: columns * cellSizePx + 2 * gridOffsetPx,
        height: rows * cellSizePx + 2 * gridOffsetPx,
        totalWidth: columns * cellSizePx + 2 * gridOffsetPx + 2 * gridOffsetPx,
        totalHeight: rows * cellSizePx + 2 * gridOffsetPx + 2 * gridOffsetPx,
    }
}

/**
 * Returns the absolute pixel coordinates of the top left corner of the specified square.
 */
export function squareCoordinates(
    { cellSizePx, gridOffsetPx }: Dimensions,
    coordinate: Coordinate,
    mode: 'center' | 'top-left' = 'top-left',
): [number, number] {
    const offset = mode === 'center' ? cellSizePx / 2 : 0

    return [
        gridOffsetPx + cellSizePx * coordinate[COLUMN] + offset,
        gridOffsetPx + cellSizePx * coordinate[ROW] + offset,
    ]
}

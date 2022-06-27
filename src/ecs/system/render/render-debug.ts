import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'
import type { IWorld } from '../../world.interface'
import { additionalMovementCost } from '../additional-movement-cost'
import { hasLineOfSight } from '../has-line-of-sight'
import { shortestPaths } from '../shortest-paths'

import type { Dimensions } from './types'
import { clear, forEachSquare, getDimensions, squareCoordinates } from './util'

function renderLineOfSightOverlay(
    dimensions: Dimensions,
    ctx: CanvasRenderingContext2D,
    origin: Coordinate,
): void {
    ctx.save()

    const { cellSizePx, world } = dimensions
    forEachSquare(dimensions, coordinates => {
        ctx.fillStyle = hasLineOfSight(world, origin, coordinates)
            ? 'rgba(0, 255, 0, 0.25)'
            : 'rgba(255, 0, 0, 0.25)'
        ctx.fillRect(...squareCoordinates(dimensions, coordinates), cellSizePx, cellSizePx)
    })

    ctx.restore()
}

export function renderMovementCosts(
    dimensions: Dimensions,
    ctx: CanvasRenderingContext2D,
    origin: Readonly<Coordinate>,
    availableMovement: number = Number.POSITIVE_INFINITY,
): void {
    ctx.save()

    const { world, cellSizePx, gridOffsetPx } = dimensions
    const costs = shortestPaths(world, origin, availableMovement)
    const fontSize = Math.ceil(cellSizePx / 5)

    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    forEachSquare(dimensions, ([column, row]) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cost = costs[column]![row]
        const additionalCost = additionalMovementCost(world, [column, row])

        if (column === origin[COLUMN] && row === origin[ROW]) {
            return
        }

        if (additionalCost > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillText(
                `↷ +${additionalCost.toString(10)}`,
                gridOffsetPx + cellSizePx * column + cellSizePx / 2,
                gridOffsetPx + cellSizePx * row + fontSize,
            )
        }

        if (cost) {
            ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'
            ctx.fillText(
                `⇢${cost.movementPoints.toString(10)}`,
                gridOffsetPx + cellSizePx * column + cellSizePx / 2,
                gridOffsetPx + cellSizePx * (row + 1) - fontSize,
            )
        }
    })

    ctx.restore()
}

function renderFps(dimensions: Dimensions, ctx: CanvasRenderingContext2D, fps: number): void {
    const WIDTH = 100
    const HEIGHT = 35

    const string = `${fps.toFixed(1)} FPS`

    ctx.fillStyle = 'rgba(0, 0, 0, 30%)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 100%)'
    ctx.fillText(string, WIDTH / 2, HEIGHT / 2, WIDTH)
}

export function renderDebug(
    world: IWorld,
    settings: Pick<Dimensions, 'cellSizePx' | 'gridOffsetPx'>,
    ctx: CanvasRenderingContext2D,
    fps: number,
    origin: Coordinate | null = null,
    availableMovement: number = Number.POSITIVE_INFINITY,
): void {
    const dimensions = getDimensions(world, settings)

    ctx.lineWidth = 1
    ctx.setLineDash([])

    clear(dimensions, ctx)
    renderFps(dimensions, ctx, fps)

    if (origin) {
        renderLineOfSightOverlay(dimensions, ctx, origin)
        renderMovementCosts(dimensions, ctx, origin, availableMovement)
    }
}

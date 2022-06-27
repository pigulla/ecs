import type { IReadonlyWorld } from '../../../ecs'
import { Visual } from '../../component'
import { Destination, MovementGraph, Origin } from '../../engine'
import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'
import { additionalMovementCost, hasLineOfSight, shortestPaths } from '../functional'

import type { Dimensions } from './types'
import { clear, forEachSquare, getDimensions, squareCoordinates, withVisual } from './util'

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

export function renderShortestPath(
    dimensions: Dimensions,
    ctx: CanvasRenderingContext2D,
    path: readonly Coordinate[],
): void {
    if (path.length <= 2) {
        return
    }

    withVisual(ctx, new Visual({ lineDash: [1, 0], lineWidth: 2, strokeStyle: 'red' }), () => {
        const [head, ...tail] = path

        ctx.moveTo(...squareCoordinates(dimensions, head, 'center'))

        for (const step of tail) {
            ctx.lineTo(...squareCoordinates(dimensions, step, 'center'))
        }

        ctx.stroke()
    })

    withVisual(ctx, new Visual({ lineWidth: 1, fillStyle: 'red' }), () => {
        const RADIUS = 3

        for (const coordinate of path) {
            ctx.beginPath()
            ctx.ellipse(
                ...squareCoordinates(dimensions, coordinate, 'center'),
                RADIUS,
                RADIUS,
                0,
                0,
                2 * Math.PI,
            )
            ctx.fill()
        }
    })
}

export function renderMovementCosts(
    dimensions: Dimensions,
    ctx: CanvasRenderingContext2D,
    origin: Coordinate,
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
    world: IReadonlyWorld,
    settings: Pick<Dimensions, 'cellSizePx' | 'gridOffsetPx'>,
    ctx: CanvasRenderingContext2D,
    fps: number,
    availableMovement: number = Number.POSITIVE_INFINITY,
): void {
    const dimensions = getDimensions(world, settings)
    const origin = world.getGlobalState(Origin).get()
    const destination = world.getGlobalState(Destination).get()

    ctx.lineWidth = 1
    ctx.setLineDash([])

    clear(dimensions, ctx)
    renderFps(dimensions, ctx, fps)

    if (origin) {
        renderLineOfSightOverlay(dimensions, ctx, origin)
        renderMovementCosts(dimensions, ctx, origin, availableMovement)

        if (destination) {
            const path = world.getGlobalState(MovementGraph).getShortestPath(origin, destination)

            if (path) {
                renderShortestPath(dimensions, ctx, path)
            }
        }
    }
}

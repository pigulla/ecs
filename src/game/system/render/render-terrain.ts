import rgba from 'color-rgba'

import type { IWorld } from '../../../ecs'
import { Location, obstructsMovement, OrthogonalLine, Terrain, Visual } from '../../component'
import { COLUMN, ROW } from '../../geometry'

import type { Dimensions } from './types'
import { clear, getDimensions, withVisual } from './util'

function renderTerrains(
    { world, gridOffsetPx, cellSizePx }: Dimensions,
    ctx: CanvasRenderingContext2D,
): void {
    const entities = world.findEntities([Location, Terrain, Visual], [])

    for (const entity of entities) {
        const location = world.getComponentOf(entity, Location)
        const visual = world.getComponentOf(entity, Visual)
        const terrain = world.getComponentOf(entity, Terrain)

        withVisual(ctx, visual, () => {
            if (visual.fillStyle) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const value = rgba(visual.fillStyle)

                if (value) {
                    const [r, g, b, a] = value as [number, number, number, number]
                    const alpha = Math.min(1, a * terrain.additionalMovementPoints)
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
                }
            }

            ctx.fillRect(
                gridOffsetPx + cellSizePx * location.coordinates[COLUMN],
                gridOffsetPx + cellSizePx * location.coordinates[ROW],
                cellSizePx,
                cellSizePx,
            )
        })
    }
}

function renderObstructions(
    { world, gridOffsetPx, cellSizePx }: Dimensions,
    ctx: CanvasRenderingContext2D,
): void {
    const obstacles = world.findEntities([OrthogonalLine, Visual], [obstructsMovement])

    for (const obstacle of obstacles) {
        const line = world.getComponentOf(obstacle, OrthogonalLine)

        withVisual(ctx, world.getComponentOf(obstacle, Visual), () => {
            ctx.beginPath()
            ctx.moveTo(
                gridOffsetPx + cellSizePx * line.from[COLUMN],
                gridOffsetPx + cellSizePx * line.from[ROW],
            )
            ctx.lineTo(
                gridOffsetPx + cellSizePx * line.to[COLUMN],
                gridOffsetPx + cellSizePx * line.to[ROW],
            )
            ctx.stroke()
        })
    }
}

export function renderTerrain(
    world: IWorld,
    settings: Pick<Dimensions, 'cellSizePx' | 'gridOffsetPx'>,
    ctx: CanvasRenderingContext2D,
): void {
    const dimensions = getDimensions(world, settings)

    ctx.lineWidth = 1
    ctx.setLineDash([])

    clear(dimensions, ctx)
    renderTerrains(dimensions, ctx)
    renderObstructions(dimensions, ctx)
}

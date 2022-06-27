import rgba from 'color-rgba'

import type { IWorld } from '../../../ecs'
import { Location, obstructsMovement, OrthogonalLine, Terrain, Visual } from '../../component'
import { COLUMN, ROW } from '../../geometry'

import type { Dimensions } from './types'
import { clear, forEachSquare, getDimensions, withVisual } from './util'

const color = {
    background: 'rgba(255, 255, 255, 1.0)',
    grid: 'rgba(0, 0, 0, 0.5)',
    outsideBox: 'rgba(0, 0, 0, 1.0)',
    coordinates: 'rgba(0, 0, 0, 0.25)',
    outsideCoordinates: 'rgba(0, 0, 0, 0.5)',
    wall: 'rgba(0, 0, 0, 1.0)',
    door: 'rgb(255, 127, 0, 1.0)',
    window: 'rgb(0, 96, 192, 1.0)',
}

function renderOutsideCoordinates(
    { world, cellSizePx, gridOffsetPx }: Dimensions,
    ctx: CanvasRenderingContext2D,
): void {
    ctx.save()

    const fontSize = Math.ceil(cellSizePx / 3)

    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = color.outsideCoordinates
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let row = 0; row < world.rows; row++) {
        ctx.fillText(
            row.toString(10),
            gridOffsetPx - cellSizePx / 2,
            gridOffsetPx + cellSizePx * row + cellSizePx / 2,
        )
        ctx.fillText(
            row.toString(10),
            world.columns * cellSizePx + gridOffsetPx + cellSizePx / 2,
            gridOffsetPx + cellSizePx * row + cellSizePx / 2,
        )
    }

    for (let column = 0; column < world.columns; column++) {
        ctx.fillText(
            column.toString(10),
            gridOffsetPx + cellSizePx * column + cellSizePx / 2,
            gridOffsetPx - cellSizePx / 2,
        )
        ctx.fillText(
            column.toString(10),
            gridOffsetPx + cellSizePx * column + cellSizePx / 2,
            world.rows * cellSizePx + gridOffsetPx + cellSizePx / 2,
        )
    }

    ctx.restore()
}

function renderCoordinates(dimensions: Dimensions, ctx: CanvasRenderingContext2D): void {
    ctx.save()

    const { cellSizePx, gridOffsetPx } = dimensions

    forEachSquare(dimensions, ([column, row]) => {
        const text = `${column}:${row}`
        const fontSize = Math.ceil(cellSizePx / 4)

        ctx.font = `${fontSize}px sans-serif`
        ctx.fillStyle = color.coordinates
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.fillText(
            text,
            gridOffsetPx + cellSizePx * column + cellSizePx / 2,
            gridOffsetPx + cellSizePx * row + cellSizePx / 2,
        )
    })

    ctx.restore()
}

function renderTerrain(
    { world, gridOffsetPx, cellSizePx }: Dimensions,
    ctx: CanvasRenderingContext2D,
): void {
    const entities = world.findEntities([Location, Terrain, Visual], [])

    for (const entity of entities) {
        const location = world.getComponent(entity, Location)
        const visual = world.getComponent(entity, Visual)
        const terrain = world.getComponent(entity, Terrain)

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
        const line = world.getComponent(obstacle, OrthogonalLine)

        withVisual(ctx, world.getComponent(obstacle, Visual), () => {
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

function renderOutsideBox(
    { gridOffsetPx, cellSizePx, world }: Dimensions,
    ctx: CanvasRenderingContext2D,
): void {
    ctx.save()

    ctx.strokeStyle = color.outsideBox
    ctx.strokeRect(gridOffsetPx, gridOffsetPx, world.columns * cellSizePx, world.rows * cellSizePx)

    ctx.restore()
}

function renderGrid(
    { gridOffsetPx, cellSizePx, world }: Dimensions,
    ctx: CanvasRenderingContext2D,
): void {
    ctx.save()

    ctx.strokeStyle = color.grid
    ctx.setLineDash([1, 2])

    for (let row = 1; row < world.rows; row++) {
        ctx.beginPath()
        ctx.moveTo(gridOffsetPx, gridOffsetPx + row * cellSizePx)
        ctx.lineTo(gridOffsetPx + world.columns * cellSizePx, gridOffsetPx + row * cellSizePx)
        ctx.stroke()
    }

    for (let column = 1; column < world.columns; column++) {
        ctx.beginPath()
        ctx.moveTo(gridOffsetPx + column * cellSizePx, gridOffsetPx)
        ctx.lineTo(gridOffsetPx + column * cellSizePx, gridOffsetPx + world.rows * cellSizePx)
        ctx.stroke()
    }

    ctx.restore()
}

export function renderBackground(
    world: IWorld,
    settings: Pick<Dimensions, 'cellSizePx' | 'gridOffsetPx'>,
    ctx: CanvasRenderingContext2D,
): void {
    const dimensions = getDimensions(world, settings)

    ctx.lineWidth = 1
    ctx.setLineDash([])

    clear(dimensions, ctx)
    renderGrid(dimensions, ctx)
    renderOutsideBox(dimensions, ctx)
    renderCoordinates(dimensions, ctx)
    renderOutsideCoordinates(dimensions, ctx)
    renderTerrain(dimensions, ctx)
    renderObstructions(dimensions, ctx)
}

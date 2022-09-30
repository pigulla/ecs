import type { IWorld } from '../../../ecs'
import { Location, Visual } from '../../component'

import { clear } from './util'

interface Options {
    cellSizePx: number
}

export function renderEntities(
    { cellSizePx }: Options,
    world: IWorld,
    ctx: CanvasRenderingContext2D,
): void {
    clear({ width: ctx.canvas.width, height: ctx.canvas.height }, ctx)

    for (const entity of world.findEntities([Location, Visual])) {
        const [column, row] = world.getComponent(entity, Location).coordinates
        const [r, g, b] = world.getComponent(entity, Visual).color

        ctx.save()

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(cellSizePx * column, cellSizePx * row, cellSizePx, cellSizePx)

        ctx.restore()
    }
}

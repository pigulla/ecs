import type { IWorld } from '../../../ecs'
import { Fire, Location } from '../../component'

import { clear } from './util'

interface Options {
    cellSizePx: number
}

export function renderFire(
    { cellSizePx }: Options,
    world: IWorld,
    ctx: CanvasRenderingContext2D,
): void {
    clear({ width: ctx.canvas.width, height: ctx.canvas.height }, ctx)

    for (const entity of world.findEntities([Fire, Location])) {
        const [column, row] = world.getComponent(entity, Location).coordinates
        const { intensity } = world.getComponent(entity, Fire)

        ctx.save()

        const alpha = Math.min(Math.max(intensity, 0), Fire.MAX_INTENSITY) / Fire.MAX_INTENSITY
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`
        ctx.fillRect(cellSizePx * column, cellSizePx * row, cellSizePx, cellSizePx)

        ctx.restore()
    }
}

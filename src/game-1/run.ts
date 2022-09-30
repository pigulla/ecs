/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { IWorld } from '../ecs'
import type { ICanvas, IControl } from '../framework'
import { startGameLoop } from '../framework'
import type { Coordinate } from '../framework/geometry'

import { createWallsFromPoints } from './entity'
import { createAdjacentMovementSystem } from './system/graph'
import { getDimensions, renderBackground, renderDebug } from './system/render'

export function run(world: IWorld, canvas: ICanvas, control: IControl): void {
    const dimensions = getDimensions(world, { cellSizePx: 50, gridOffsetPx: 50 })

    let mouseCoords: Coordinate | null = null

    canvas.resize({ width: dimensions.totalWidth, height: dimensions.totalHeight })
    control.onMouseMove((event: MouseEvent): void => {
        const { columns, rows, gridOffsetPx, cellSizePx } = dimensions
        const { offsetLeft, offsetTop } = event.target as HTMLDivElement
        const x = event.clientX - offsetLeft - gridOffsetPx
        const y = event.clientY - offsetTop - gridOffsetPx

        mouseCoords =
            x < 0 || x > columns * cellSizePx || y < 0 || y > rows * cellSizePx
                ? null
                : [Math.floor(x / cellSizePx), Math.floor(y / cellSizePx)]
    })

    const background = canvas.create({
        classes: ['background'],
        styles: { zIndex: '1', backgroundColor: 'white' },
    })
    const debug = canvas.create({ classes: ['debug'], styles: { zIndex: '3' } })
    let averageFps = 0

    world.addSystem(createAdjacentMovementSystem(world))
    world.addSystem(world => renderBackground(world, dimensions, background))
    world.addSystem(world => renderDebug(world, dimensions, debug, averageFps, mouseCoords, 15))

    startGameLoop((time, fps) => {
        averageFps = fps
        world.step()
    })

    setTimeout(() => {
        createWallsFromPoints(world, [
            [18, 3],
            [18, 7],
        ])
    }, 3000)
}

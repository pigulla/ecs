import type { IWorld } from '../ecs'
import type { ICanvas, IControl, IGameLoop } from '../framework'
import { createGameLoop } from '../framework'

import { Direction, Movement } from './component'
import { foodCollision, wallCollision } from './system/collision'
import { Fact } from './system/fact'
import { moveEntities, randomizeMovement } from './system/movement'
import { renderBackground, renderEntities } from './system/render'
import { playerTag } from './tag'

export function run(world: IWorld<Fact>, canvas: ICanvas, control: IControl): IGameLoop {
    const cellSizePx = 15
    const columns = world.getFact<number>(Fact.COLUMNS)
    const rows = world.getFact<number>(Fact.ROWS)

    let directionCommand: Direction | null = Direction.UP

    canvas.resize({ width: columns * cellSizePx, height: rows * cellSizePx })
    control.onKeyDown(event => {
        switch (event.key) {
            case 'ArrowDown': {
                directionCommand = Direction.DOWN
                break
            }
            case 'ArrowUp': {
                directionCommand = Direction.UP
                break
            }
            case 'ArrowLeft': {
                directionCommand = Direction.LEFT
                break
            }
            case 'ArrowRight': {
                directionCommand = Direction.RIGHT
                break
            }
        }
    })

    const background = canvas.create({ classes: ['background'], styles: {} })
    const foreground = canvas.create({ classes: ['foreground'], styles: {} })

    world.addSystem((_world, _signals) =>
        renderBackground(
            {
                cellSizePx,
                rows,
                columns,
            },
            background,
        ),
    )
    world.addSystem((world, _signals) => {
        renderEntities({ cellSizePx }, world, foreground)
    })
    world.addSystem(moveEntities)
    world.addSystem(randomizeMovement)
    world.addSystem(foodCollision)
    world.addSystem(wallCollision)

    const stepEveryMs = 100
    let nextStepAtMs = stepEveryMs

    function updatePlayerMovement(): void {
        const newDirection = directionCommand
        const player = world.getEntity([], [playerTag])

        directionCommand = null

        if (newDirection === null) {
            return
        } else {
            world.setComponent(player, new Movement({ direction: newDirection, bounce: false }))
        }
    }

    return createGameLoop((timeMs, _fps) => {
        if (timeMs >= nextStepAtMs) {
            updatePlayerMovement()

            world.step()
            nextStepAtMs += stepEveryMs
        }
    })
}

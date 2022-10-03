import type { IWorld } from '../ecs'
import type { ICanvas, IControl, IGameLoop } from '../framework'
import { createGameLoop } from '../framework'

import { Direction, Movement } from './component'
import { Fact } from './fact'
import { gameOverSignal } from './signal'
import { foodCollision, wallCollision } from './system/collision'
import { moveEntities } from './system/movement'
import { renderBackground, renderEntities } from './system/render'
import { sound } from './system/sound'
import { dynamicTag, playerTag } from './tag'

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
    world.addSystem(moveEntities)
    world.addSystem(foodCollision)
    world.addSystem(wallCollision)
    world.addSystem(sound)
    world.addSystem((world, signals) => {
        if (signals.has(gameOverSignal)) {
            for (const entity of world.findEntities([], [dynamicTag])) {
                world.removeEntity(entity)
            }
        }
    })
    world.addSystem((world, _signals) => {
        renderEntities({ cellSizePx }, world, foreground)
    })

    const stepEveryMs = 150
    let nextStepAtMs = stepEveryMs

    function updatePlayerMovement(): void {
        const newDirection = directionCommand
        const player = world.findEntity([], [playerTag])

        if (player) {
            directionCommand = null

            if (newDirection === null) {
                return
            } else {
                world.setComponent(player, new Movement({ direction: newDirection }))
            }
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

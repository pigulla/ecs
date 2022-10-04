import type { IWorld } from '../ecs'
import type { ICanvas, IControl, IGameLoop } from '../framework'
import { createGameLoop } from '../framework'

import { Movement } from './component'
import { Direction } from './direction'
import { Fact } from './fact'
import { GAME_OVER } from './signal'
import { fireCollision, foodCollision, wallCollision } from './system/collision'
import { fireMovement, fireSpawner, fireSpawnTrigger } from './system/fire'
import { moveEntities } from './system/movement'
import { renderGrid, renderEntities, renderFire } from './system/render'
import { sound } from './system/sound'
import { DYNAMIC, PLAYER } from './tag'

export function run(world: IWorld<Fact>, canvas: ICanvas, control: IControl): IGameLoop {
    const cellSizePx = 15
    const columns = world.getFact<number>(Fact.COLUMNS)
    const rows = world.getFact<number>(Fact.ROWS)

    let directionCommand: Direction | null = null // Direction.UP

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

    const grid = canvas.create({ classes: ['grid'], styles: {} })
    const background = canvas.create({ classes: ['foreground'], styles: {} })
    const foreground = canvas.create({ classes: ['foreground'], styles: {} })

    world.addSystem((_world, _signals) =>
        renderGrid(
            {
                cellSizePx,
                rows,
                columns,
            },
            grid,
        ),
    )
    world.addSystem(moveEntities)
    world.addSystem(foodCollision)
    world.addSystem(wallCollision)
    world.addSystem(fireCollision)
    world.addSystem(fireMovement)
    world.addSystem(fireSpawner)
    world.addSystem(fireSpawnTrigger)
    world.addSystem(sound)
    world.addSystem((world, signals) => {
        if (signals.has(GAME_OVER)) {
            for (const entity of world.findEntities([], [DYNAMIC])) {
                world.removeEntity(entity)
            }
        }
    })
    world.addSystem((world, _signals) => {
        renderFire({ cellSizePx }, world, background)
    })
    world.addSystem((world, _signals) => {
        renderEntities({ cellSizePx }, world, foreground)
    })

    const stepEveryMs = 150
    let nextStepAtMs = stepEveryMs

    function updatePlayerMovement(): void {
        const newDirection = directionCommand
        const player = world.findEntity([], [PLAYER])

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

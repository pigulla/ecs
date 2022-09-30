import type { IWorld, Signal } from '../ecs'
import type { ICanvas, IControl } from '../framework'
import { startGameLoop } from '../framework'

import { Direction, Movement } from './component'
import { Fact } from './system/fact'
import { moveEntities, randomizeMovement } from './system/movement'
import { renderBackground, renderEntities } from './system/render'
import { playerTag } from './tag'

export function run(world: IWorld<Fact>, canvas: ICanvas, control: IControl): void {
    const cellSizePx = 15
    const columns = world.getFact<number>(Fact.COLUMNS)
    const rows = world.getFact<number>(Fact.ROWS)

    let directionCommand: Direction | null = null

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

    world.addSystem(_world =>
        renderBackground(
            {
                cellSizePx,
                rows,
                columns,
            },
            background,
        ),
    )
    world.addSystem((world: IWorld<Fact>, _signals: ReadonlySet<Signal>) => {
        renderEntities({ cellSizePx }, world, foreground)
    })
    world.addSystem((world: IWorld<Fact>, _signals: ReadonlySet<Signal>) => {
        moveEntities(world)
    })
    world.addSystem((world: IWorld<Fact>, _signals: ReadonlySet<Signal>) => {
        randomizeMovement(world)
    })

    const stepEveryMs = 100
    let nextStepAtMs = stepEveryMs

    function updatePlayerMovement(): void {
        const newDirection = directionCommand
        const player = world.getEntity([], [playerTag])
        const currentDirection = world.findComponent(player, Movement)?.direction ?? null

        directionCommand = null

        if (newDirection === null) {
            return
        } else if (newDirection === currentDirection) {
            world.removeComponent(player, Movement)
        } else {
            world.setComponent(player, new Movement({ direction: newDirection, bounce: false }))
        }
    }

    startGameLoop((timeMs, _fps) => {
        if (timeMs >= nextStepAtMs) {
            updatePlayerMovement()

            world.step()
            nextStepAtMs += stepEveryMs
        }
    })
}

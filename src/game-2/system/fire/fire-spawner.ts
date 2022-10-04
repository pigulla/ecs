import type { IWorld, Signal } from '../../../ecs'
import { randomInt } from '../../../framework'
import { Fire, Location } from '../../component'
import { Direction } from '../../direction'
import { createFireEntity } from '../../entity/fire'
import { Fact } from '../../fact'
import { SPAWN_FIRE } from '../../signal'

export function fireSpawner(world: IWorld<Fact>, signals: ReadonlySet<Signal>): void {
    if (!signals.has(SPAWN_FIRE)) {
        return
    }

    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)
    let direction: Direction
    let row: number
    let column: number

    if (Math.random() > 0.5) {
        // spawn vertical fire
        column = randomInt(1, columns - 2)

        if (Math.random() > 0.5) {
            // spawn at top
            row = 0
            direction = Direction.DOWN
        } else {
            // spawn at bottom
            row = rows - 1
            direction = Direction.UP
        }
    } else {
        // spawn horizontal fire
        row = randomInt(1, rows - 2)

        if (Math.random() > 0.5) {
            // spawn at left side
            column = 0
            direction = Direction.RIGHT
        } else {
            // spawn at right side
            column = columns - 1
            direction = Direction.LEFT
        }
    }

    createFireEntity(
        world,
        new Location({ coordinates: [column, row] }),
        new Fire({ intensity: Fire.MAX_INTENSITY, direction }),
    )
}

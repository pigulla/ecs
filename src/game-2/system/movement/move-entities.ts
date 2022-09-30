import type { IWorld } from '../../../ecs'
import { Direction, Location, Movement } from '../../component'
import { Fact } from '../fact'

export function moveEntities(world: IWorld<Fact>): void {
    for (const entity of world.findEntities([Location, Movement])) {
        const columns = world.getFact<number>(Fact.COLUMNS)
        const rows = world.getFact<number>(Fact.ROWS)
        const [column, row] = world.getComponent(entity, Location).coordinates
        const { direction, bounce } = world.getComponent(entity, Movement)

        let newDirection = direction
        let newColumn = column
        let newRow = row

        if (direction === Direction.LEFT) {
            if (column === 0) {
                if (bounce) {
                    newDirection = Direction.RIGHT
                    newColumn = column + 1
                }
            } else {
                newColumn = column - 1
            }
        }
        if (direction === Direction.RIGHT) {
            if (column === columns - 1) {
                if (bounce) {
                    newDirection = Direction.LEFT
                    newColumn = column - 1
                }
            } else {
                newColumn = column + 1
            }
        }
        if (direction === Direction.UP) {
            if (row === 0) {
                if (bounce) {
                    newDirection = Direction.DOWN
                    newRow = row + 1
                }
            } else {
                newRow = row - 1
            }
        }
        if (direction === Direction.DOWN) {
            if (row === rows - 1) {
                if (bounce) {
                    newDirection = Direction.UP
                    newRow = row - 1
                }
            } else {
                newRow = row + 1
            }
        }

        world.setComponent(entity, new Location({ coordinates: [newColumn, newRow] }))
        world.setComponent(entity, new Movement({ direction: newDirection, bounce }))
    }
}

import type { IWorld } from '../../../ecs'
import { Direction, Location, Movement } from '../../component'
import type { Fact } from '../../fact'

export function moveEntities(world: IWorld<Fact>): void {
    for (const entity of world.findEntities([Location, Movement])) {
        const [column, row] = world.getComponent(entity, Location).coordinates
        const { direction } = world.getComponent(entity, Movement)

        const newDirection = direction
        let newColumn = column
        let newRow = row

        if (direction === Direction.LEFT) {
            newColumn = column - 1
        }
        if (direction === Direction.RIGHT) {
            newColumn = column + 1
        }
        if (direction === Direction.UP) {
            newRow = row - 1
        }
        if (direction === Direction.DOWN) {
            newRow = row + 1
        }

        world.setComponent(entity, new Location({ coordinates: [newColumn, newRow] }))
        world.setComponent(entity, new Movement({ direction: newDirection }))
    }
}

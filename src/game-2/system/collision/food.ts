import type { IWorld, Signal } from '../../../ecs'
import { Location } from '../../component'
import { foodTag, playerTag } from '../../tag'
import { Fact } from '../fact'

export function foodCollision(world: IWorld<Fact>, _signals: ReadonlySet<Signal>): void {
    function randomLocation(): Location {
        const rows = world.getFact<number>(Fact.ROWS)
        const columns = world.getFact<number>(Fact.COLUMNS)

        return new Location({
            coordinates: [Math.floor(Math.random() * columns), Math.floor(Math.random() * rows)],
        })
    }

    const player = world.getEntity([Location], [playerTag])
    const location = world.getComponent(player, Location)

    for (const entity of world.findEntities([Location], [foodTag])) {
        if (world.getComponent(entity, Location).equals(location)) {
            world.setComponent(entity, randomLocation())
        }
    }
}

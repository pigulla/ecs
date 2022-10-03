import type { IWorld, Signal } from '../../../ecs'
import { Location } from '../../component'
import { createFoodEntity } from '../../entity'
import { Fact } from '../../fact'
import { foodCollectedSignal } from '../../signal'
import { foodTag, playerTag } from '../../tag'

export function foodCollision(world: IWorld<Fact>, signals: ReadonlySet<Signal>): void {
    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)

    function randomLocation(): Location {
        return new Location({
            coordinates: [Math.floor(Math.random() * columns), Math.floor(Math.random() * rows)],
        })
    }

    if (signals.has(foodCollectedSignal)) {
        createFoodEntity(world, randomLocation())
    }

    const player = world.findEntity([Location], [playerTag])

    if (player === null) {
        return
    }

    const location = world.getComponent(player, Location)

    for (const food of world.findEntities([Location], [foodTag])) {
        if (world.getComponent(food, Location).equals(location)) {
            world.signal(foodCollectedSignal)
            world.removeEntity(food)
        }
    }
}

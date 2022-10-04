import type { IWorld, Signal } from '../../../ecs'
import { Location } from '../../component'
import { createFoodEntity } from '../../entity'
import { Fact } from '../../fact'
import { FOOD_COLLECTED } from '../../signal'
import { FOOD, PLAYER } from '../../tag'

export function foodCollision(world: IWorld<Fact>, signals: ReadonlySet<Signal>): void {
    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)

    function randomLocation(): Location {
        return new Location({
            coordinates: [Math.floor(Math.random() * columns), Math.floor(Math.random() * rows)],
        })
    }

    if (signals.has(FOOD_COLLECTED)) {
        createFoodEntity(world, randomLocation())
    }

    const player = world.findEntity([Location], [PLAYER])

    if (player === null) {
        return
    }

    const location = world.getComponent(player, Location)

    for (const food of world.findEntities([Location], [FOOD])) {
        if (world.getComponent(food, Location).equals(location)) {
            world.signal(FOOD_COLLECTED)
            world.removeEntity(food)
        }
    }
}

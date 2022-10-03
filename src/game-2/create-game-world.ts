import type { IWorld } from '../ecs'
import { createWorld } from '../framework'

import { Location, Visual } from './component'
import { createFoodEntity } from './entity'
import type { Fact } from './system'
import { dynamicTag, playerTag } from './tag'

export function createGameWorld(): IWorld<Fact> {
    const world = createWorld<Fact>({ rows: 25, columns: 40 })

    populateWorld(world)

    return world
}

export function populateWorld(world: IWorld): void {
    const player = world.createEntity({ name: 'player' })
    world.addTag(player, playerTag)
    world.addTag(player, dynamicTag)
    world.setComponent(player, new Visual({ color: [0, 0, 0] }))
    world.setComponent(player, new Location({ coordinates: [20, 20] }))

    createFoodEntity(world, new Location({ coordinates: [20, 18] }))
}

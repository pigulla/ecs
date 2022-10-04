import type { IWorld } from '../ecs'
import { createWorld } from '../framework'

import { Location, Visual } from './component'
import { createFoodEntity } from './entity'
import type { Fact } from './fact'
import { DYNAMIC, PLAYER } from './tag'

export function createGameWorld(): IWorld<Fact> {
    const world = createWorld<Fact>({ rows: 25, columns: 40 })

    populateWorld(world)

    return world
}

export function populateWorld(world: IWorld): void {
    const player = world.createEntity({ name: 'player' })

    world.addTag(player, PLAYER)
    world.addTag(player, DYNAMIC)
    world.setComponent(player, new Visual({ color: [0, 0, 0, 1] }))
    world.setComponent(player, new Location({ coordinates: [20, 20] }))

    createFoodEntity(world, new Location({ coordinates: [20, 18] }))
}

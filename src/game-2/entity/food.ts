import type { Entity, IWorld } from '../../ecs'
import type { Location } from '../component'
import { Visual } from '../component'
import { DYNAMIC, FOOD } from '../tag'

export function createFoodEntity(world: IWorld, location: Location): Entity {
    const food = world.createEntity()

    world.setComponent(food, new Visual({ color: [16, 96, 16, 1] }))
    world.setComponent(food, location)
    world.addTag(food, FOOD)
    world.addTag(food, DYNAMIC)

    return food
}

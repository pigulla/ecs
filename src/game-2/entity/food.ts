import type { Entity, IWorld } from '../../ecs'
import type { Location } from '../component'
import { Visual } from '../component'
import { dynamicTag, foodTag } from '../tag'

export function createFoodEntity(world: IWorld, location: Location): Entity {
    const food = world.createEntity()

    world.setComponent(food, new Visual({ color: [16, 96, 16] }))
    world.setComponent(food, location)
    world.addTag(food, foodTag)
    world.addTag(food, dynamicTag)

    return food
}

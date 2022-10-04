import type { Entity, IWorld } from '../../ecs'
import type { Location, Fire } from '../component'
import { DYNAMIC } from '../tag'

export function createFireEntity(world: IWorld, location: Location, fire: Fire): Entity {
    const entity = world.createEntity()

    world.setComponent(entity, location)
    world.setComponent(entity, fire)
    world.addTag(entity, DYNAMIC)

    return entity
}

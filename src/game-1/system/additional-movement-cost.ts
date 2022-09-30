import type { IWorld } from '../../ecs'
import type { Coordinate } from '../../framework/geometry'
import { Terrain, Location, coordinateTag } from '../component'

export function additionalMovementCost(world: IWorld, coordinate: Coordinate): number {
    const tag = coordinateTag(coordinate)

    return world
        .findEntities([Terrain, Location], [tag])
        .reduce(
            (sum, entity) => sum + world.getComponent(entity, Terrain).additionalMovementPoints,
            0,
        )
}

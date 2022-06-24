import { Terrain, Location, coordinateTag } from '../component'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

export function additionalMovementCost(world: IWorld, coordinate: Readonly<Coordinate>): number {
    const tag = coordinateTag(coordinate)

    return world
        .findEntities([Terrain, Location], [tag])
        .reduce(
            (sum, entity) => sum + world.getComponent(entity, Terrain).additionalMovementPoints,
            0,
        )
}

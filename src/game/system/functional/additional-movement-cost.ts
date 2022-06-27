import type { IReadonlyWorld } from '../../../ecs'
import { Terrain, Location, coordinateTag } from '../../component'
import type { Coordinate } from '../../geometry'

export function additionalMovementCost(world: IReadonlyWorld, coordinate: Coordinate): number {
    const tag = coordinateTag(coordinate)

    return world
        .findEntities([Terrain, Location], [tag])
        .reduce(
            (sum, entity) => sum + world.getComponentOf(entity, Terrain).additionalMovementPoints,
            0,
        )
}

import type { IReadonlyWorld } from '../../../ecs'
import { Terrain, Location } from '../../component'
import type { Coordinate } from '../../geometry'
import { isSameCoordinate } from '../../geometry'

export function additionalMovementCost(world: IReadonlyWorld, coordinate: Coordinate): number {
    return world
        .findEntities([Terrain, Location], [])
        .filter(entity =>
            isSameCoordinate(world.getComponentOf(entity, Location).coordinates, coordinate),
        )
        .reduce(
            (sum, entity) => sum + world.getComponentOf(entity, Terrain).additionalMovementPoints,
            0,
        )
}

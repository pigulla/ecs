import { Terrain, Location } from '../component'
import type { Coordinate } from '../geometry'
import { isSameCoordinate } from '../geometry'
import type { IWorld } from '../world.interface'

export function additionalMovementCost(world: IWorld, coordinate: Readonly<Coordinate>): number {
    return world
        .findEntities([Terrain, Location])
        .filter(entity => isSameCoordinate(entity.getComponent(Location).coordinates, coordinate))
        .reduce((sum, entity) => sum + entity.getComponent(Terrain).additionalMovementPoints, 0)
}

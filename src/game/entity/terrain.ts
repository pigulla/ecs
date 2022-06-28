import type { IWorld, Entity } from '../../ecs'
import { Location, Terrain, Visual } from '../component'
import type { Coordinate } from '../geometry'

export function createTerrain(
    world: IWorld,
    data: { coordinate: Coordinate; additionalCost: number },
    parent?: Entity,
): Entity {
    const sand = world.createEntity({ parent })
    const location = new Location({ coordinates: data.coordinate })

    world.setComponent(sand, location)
    world.setComponent(sand, new Terrain({ additionalMovementPoints: data.additionalCost }))
    world.setComponent(sand, new Visual({ fillStyle: 'rgba(195, 128, 0, 0.15)' }))

    return sand
}

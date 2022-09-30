import type { IWorld, Entity } from '../../ecs'
import type { Coordinate } from '../../framework/geometry'
import { coordinateTag, Location, Terrain, Visual } from '../component'

export function createTerrain(
    world: IWorld,
    data: { coordinate: Coordinate; additionalCost: number },
    parent?: Entity,
): Entity {
    const sand = world.createEntity({ parent })
    const location = new Location({ coordinates: data.coordinate })

    // be careful here when the location changes! Maybe use MutationObserver here?
    world.addTag(sand, coordinateTag(location.coordinates))

    world.setComponent(sand, location)
    world.setComponent(sand, new Terrain({ additionalMovementPoints: data.additionalCost }))
    world.setComponent(sand, new Visual({ fillStyle: 'rgba(195, 128, 0, 0.15)' }))

    return sand
}

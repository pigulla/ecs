import { coordinateTag, Location, Terrain, Visual } from '../component'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

import type { Entity } from './entity'

export function createSand(
    world: IWorld,
    data: { coordinate: Coordinate },
    parent?: Entity,
): Entity {
    const sand = world.createEntity(parent)
    const location = new Location({ coordinates: data.coordinate })

    // be careful here when the location changes! Maybe use MutationObserver here?
    sand.addTag(coordinateTag(location.coordinates))

    sand.addComponent(location)
    sand.addComponent(new Terrain({ additionalMovementPoints: 3 }))
    sand.addComponent(new Visual({ fillStyle: 'rgba(195, 128, 0, 0.5)' }))

    return sand
}

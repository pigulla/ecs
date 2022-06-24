import { coordinateTag, Location, Terrain, Visual } from '../component'
import type { Entity } from '../entity'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

export function createSand(
    world: IWorld,
    data: { coordinate: Coordinate },
    parent?: Entity,
): Entity {
    const sand = world.createEntity({ parent })
    const location = new Location({ coordinates: data.coordinate })

    // be careful here when the location changes! Maybe use MutationObserver here?
    world.addTag(sand, coordinateTag(location.coordinates))

    world.addComponent(sand, location)
    world.addComponent(sand, new Terrain({ additionalMovementPoints: 3 }))
    world.addComponent(sand, new Visual({ fillStyle: 'rgba(195, 128, 0, 0.5)' }))

    return sand
}

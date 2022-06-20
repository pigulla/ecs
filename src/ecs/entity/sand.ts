import { Location, Terrain, Visual } from '../component'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

import type { Entity } from './entity'

export function createSand(
    world: IWorld,
    data: { coordinate: Coordinate },
    parent?: Entity,
): Entity {
    const window = world.createEntity(parent)

    window.addComponent(new Location({ coordinates: data.coordinate }))
    window.addComponent(new Terrain({ additionalMovementPoints: 3 }))
    window.addComponent(new Visual({ fillStyle: 'rgba(195, 128, 0, 0.5)' }))

    return window
}

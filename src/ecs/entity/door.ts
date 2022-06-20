import { Obstruction, ObstructionType, OrthogonalLine, Visual } from '../component'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

import type { Entity } from './entity'

export function createDoor(
    world: IWorld,
    data: { from: Coordinate; to: Coordinate },
    parent?: Entity,
): Entity {
    const window = world.createEntity(parent)

    window.addComponent(
        new Obstruction({ obstructs: [ObstructionType.MOVEMENT, ObstructionType.SIGHT] }),
    )
    window.addComponent(new OrthogonalLine({ from: data.from, to: data.to }))
    window.addComponent(new Visual({ strokeStyle: 'rgba(128,64,0,1.0)', lineWidth: 2.5 }))

    return window
}

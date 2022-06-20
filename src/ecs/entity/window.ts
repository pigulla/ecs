import { Obstruction, ObstructionType, OrthogonalLine, Visual } from '../component'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

import type { Entity } from './entity'

export function createWindow(
    world: IWorld,
    data: { from: Coordinate; to: Coordinate },
    parent?: Entity,
): Entity {
    const window = world.createEntity(parent)

    window.addComponent(new Obstruction({ obstructs: [ObstructionType.MOVEMENT] }))
    window.addComponent(new OrthogonalLine({ from: data.from, to: data.to }))
    window.addComponent(new Visual({ strokeStyle: 'rgba(64,64,255,0.8)', lineWidth: 2 }))

    return window
}

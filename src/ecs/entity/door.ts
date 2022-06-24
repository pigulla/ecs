import { Obstruction, ObstructionType, OrthogonalLine, Visual } from '../component'
import type { Entity } from '../entity'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

export function createDoor(
    world: IWorld,
    data: { from: Coordinate; to: Coordinate },
    parent?: Entity,
): Entity {
    const door = world.createEntity({ parent })

    world.addComponent(
        door,
        new Obstruction({ obstructs: [ObstructionType.MOVEMENT, ObstructionType.SIGHT] }),
    )
    world.addComponent(door, new OrthogonalLine({ from: data.from, to: data.to }))
    world.addComponent(door, new Visual({ strokeStyle: 'rgba(128,64,0,1.0)', lineWidth: 2.5 }))

    return door
}

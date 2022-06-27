import type { IWorld, Entity } from '../../ecs'
import { OrthogonalLine, Visual, obstructsLineOfSight, obstructsMovement } from '../component'
import type { Coordinate } from '../geometry'

export function createDoor(
    world: IWorld,
    data: { from: Coordinate; to: Coordinate },
    parent?: Entity,
): Entity {
    const door = world.createEntity({ parent })

    world.addTag(door, obstructsMovement)
    world.addTag(door, obstructsLineOfSight)

    world.setComponent(door, new OrthogonalLine({ from: data.from, to: data.to }))
    world.setComponent(door, new Visual({ strokeStyle: 'rgba(128,64,0,1.0)', lineWidth: 2.5 }))

    return door
}

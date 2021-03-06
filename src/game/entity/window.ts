import type { IWorld, Entity } from '../../ecs'
import { OrthogonalLine, Visual, obstructsMovement } from '../component'
import type { Coordinate } from '../geometry'

export function createWindow(
    world: IWorld,
    data: { from: Coordinate; to: Coordinate },
    parent?: Entity,
): Entity {
    const window = world.createEntity({ parent })

    world.addTag(window, obstructsMovement)
    world.setComponent(window, new OrthogonalLine({ from: data.from, to: data.to }))
    world.setComponent(window, new Visual({ strokeStyle: 'rgba(64,64,255,0.8)', lineWidth: 2 }))

    return window
}

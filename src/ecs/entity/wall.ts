import { Obstruction, ObstructionType, OrthogonalLine, Visual } from '../component'
import type { Coordinate } from '../geometry'
import type { IWorld } from '../world.interface'

import type { Entity } from './entity'

export function createWallsFromPoints(
    world: IWorld,
    points: [Coordinate, ...Coordinate[]],
    parent?: Entity,
): Entity[] {
    const walls: Entity[] = []

    for (let index = 1; index < points.length; index++) {
        const wall = world.createEntity({ parent })

        wall.addComponent(
            new Obstruction({
                obstructs: [ObstructionType.MOVEMENT, ObstructionType.SIGHT],
            }),
        )
        wall.addComponent(new OrthogonalLine({ from: points[index - 1]!, to: points[index]! }))
        wall.addComponent(new Visual({ strokeStyle: 'rgba(0,0,0,1.0)', lineWidth: 3 }))

        walls.push(wall)
    }

    return walls
}

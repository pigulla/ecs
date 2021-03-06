import type { IWorld, Entity } from '../../ecs'
import { obstructsLineOfSight, obstructsMovement, OrthogonalLine, Visual } from '../component'
import type { Coordinate } from '../geometry'

export function createWallsFromPoints(
    world: IWorld,
    points: [Coordinate, ...Coordinate[]],
    parent?: Entity,
): Entity {
    const wall = world.createEntity({ name: 'walls', parent })

    for (let index = 1; index < points.length; index++) {
        const segment = world.createEntity({ name: 'wall', parent: wall })

        world.addTag(segment, obstructsMovement)
        world.addTag(segment, obstructsLineOfSight)
        world.setComponent(
            segment,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new OrthogonalLine({ from: points[index - 1]!, to: points[index]! }),
        )
        world.setComponent(segment, new Visual({ strokeStyle: 'rgba(0,0,0,1.0)', lineWidth: 3 }))
    }

    return wall
}

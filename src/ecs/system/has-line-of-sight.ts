import { OrthogonalLine } from '../component'
import { obstructsLineOfSight } from '../component/obstruction'
import type { Coordinate, Line } from '../geometry'
import { intersects, COLUMN, ROW } from '../geometry'
import type { IWorld } from '../world.interface'

export function hasLineOfSight(
    world: IWorld,
    from: Readonly<Coordinate>,
    to: Readonly<Coordinate>,
): boolean {
    const los: Line = [
        [from[COLUMN] + 0.5, from[ROW] + 0.5],
        [to[COLUMN] + 0.5, to[ROW] + 0.5],
    ]

    return world
        .findEntities([OrthogonalLine], [obstructsLineOfSight])
        .map(entity => world.getComponent(entity, OrthogonalLine))
        .every(line => !intersects(los, [line.from, line.to]))
}

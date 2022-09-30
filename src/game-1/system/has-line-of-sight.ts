import type { IWorld } from '../../ecs'
import type { Coordinate, Line } from '../../framework/geometry'
import { intersects, COLUMN, ROW } from '../../framework/geometry'
import { OrthogonalLine, obstructsLineOfSight } from '../component'

export function hasLineOfSight(world: IWorld, from: Coordinate, to: Coordinate): boolean {
    const los: Line = [
        [from[COLUMN] + 0.5, from[ROW] + 0.5],
        [to[COLUMN] + 0.5, to[ROW] + 0.5],
    ]

    return world
        .findEntities([OrthogonalLine], [obstructsLineOfSight])
        .map(entity => world.getComponent(entity, OrthogonalLine))
        .every(line => !intersects(los, [line.from, line.to]))
}

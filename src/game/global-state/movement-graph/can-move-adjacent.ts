import type { IReadonlyWorld } from '../../../ecs'
import { obstructsMovement, OrthogonalLine } from '../../component'
import { intersects, COLUMN, ROW } from '../../geometry'
import type { Coordinate, Line } from '../../geometry'

import type { Direction } from './direction'
import { directionDelta } from './direction'

export function canMoveAdjacent(
    world: IReadonlyWorld,
    from: Coordinate,
    direction: Direction,
): boolean {
    const [dc, dr] = directionDelta[direction]
    const los: Line = [
        [from[COLUMN] + 0.5, from[ROW] + 0.5],
        [from[COLUMN] + dc + 0.5, from[ROW] + dr + 0.5],
    ]

    return world
        .findEntities([OrthogonalLine], [obstructsMovement])
        .map(entity => world.getComponentOf(entity, OrthogonalLine))
        .every(line => !intersects(los, [line.from, line.to]))
}

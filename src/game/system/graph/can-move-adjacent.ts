import type { IWorld } from '../../../ecs'
import { OrthogonalLine } from '../../component'
import { obstructsMovement } from '../../component/obstruction'
import { intersects, COLUMN, ROW } from '../../geometry'
import type { Coordinate, Line } from '../../geometry'

import type { Direction } from './direction'
import { directionDelta } from './direction'

export function canMoveAdjacent(world: IWorld, from: Coordinate, direction: Direction): boolean {
    const [dc, dr] = directionDelta[direction]
    const los: Line = [
        [from[COLUMN] + 0.5, from[ROW] + 0.5],
        [from[COLUMN] + dc + 0.5, from[ROW] + dr + 0.5],
    ]

    return world
        .findEntities([OrthogonalLine], [obstructsMovement])
        .map(entity => world.getComponent(entity, OrthogonalLine))
        .every(line => !intersects(los, [line.from, line.to]))
}

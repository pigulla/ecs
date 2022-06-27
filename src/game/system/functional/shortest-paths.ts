import type { IReadonlyWorld } from '../../../ecs'
import { MovementGraph } from '../../engine/movement-graph'
import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'

import { additionalMovementCost } from './additional-movement-cost'

interface Result {
    path: Coordinate[]
    movementPoints: number
}

function initShortestPathResult(world: IReadonlyWorld, origin: Coordinate): (Result | null)[][] {
    const result = Array.from({ length: world.columns }).map(() =>
        Array.from<Result | null>({ length: world.rows }).fill(null),
    )

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result[origin[COLUMN]]![origin[ROW]] = { path: [], movementPoints: 0 }
    return result
}

export function shortestPaths(
    world: IReadonlyWorld,
    origin: Coordinate,
    maximum: number = Number.POSITIVE_INFINITY,
): (Result | null)[][] {
    interface QueueItem {
        coordinate: Coordinate
        movementPoints: number
        path: Coordinate[]
    }

    const movementGraph = world.getGlobalState(MovementGraph)
    const result = initShortestPathResult(world, origin)
    const queue: QueueItem[] = [{ coordinate: origin, movementPoints: 0, path: [] }]
    let current: QueueItem | undefined

    while ((current = queue.shift())) {
        for (const [neighbor, cost] of movementGraph.getCostToNeighbors(current.coordinate)) {
            const movementPoints =
                current.movementPoints + cost + additionalMovementCost(world, neighbor)
            const path = [...current.path, neighbor]
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const previousResult = result[neighbor[COLUMN]]![neighbor[ROW]]

            if (
                (previousResult && previousResult.movementPoints <= movementPoints) ||
                movementPoints > maximum
            ) {
                continue
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result[neighbor[COLUMN]]![neighbor[ROW]] = {
                path,
                movementPoints,
            }
            queue.push({
                path,
                movementPoints,
                coordinate: neighbor,
            })
        }
    }

    return result
}

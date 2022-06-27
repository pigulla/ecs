import type { Coordinate } from '../geometry'
import { COLUMN, ROW } from '../geometry'
import type { IWorld } from '../world.interface'

import { additionalMovementCost } from './additional-movement-cost'
import { AdjacentMovement } from './graph/adjacent-movement'

interface Result {
    path: Readonly<Coordinate>[]
    movementPoints: number
}

export function shortestPaths(
    world: IWorld,
    origin: Readonly<Coordinate>,
    maximum: number = Number.POSITIVE_INFINITY,
): (Result | null)[][] {
    interface QueueItem {
        coordinate: Readonly<Coordinate>
        movementPoints: number
        path: Readonly<Coordinate>[]
    }

    const amc = world.findEntities([AdjacentMovement], [])[0]
    const adjacentMovement = world.getComponent(amc, AdjacentMovement)

    const result = initShortestPathResult()
    const queue: QueueItem[] = [{ coordinate: origin, movementPoints: 0, path: [] }]
    let current: QueueItem | undefined

    while ((current = queue.shift())) {
        for (const [neighbor, cost] of adjacentMovement.getCostToNeighbors(current.coordinate)) {
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

    function initShortestPathResult(): (Result | null)[][] {
        const result = Array.from({ length: world.columns }).map(() =>
            Array.from<Result | null>({ length: world.rows }).fill(null),
        )

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result[origin[COLUMN]]![origin[ROW]] = { path: [], movementPoints: 0 }
        return result
    }
}

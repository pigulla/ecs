import type { Coordinate } from '../geometry'
import { COLUMN, ROW } from '../geometry'
import type { IWorld } from '../world.interface'

import { additionalMovementCost } from './additional-movement-cost'

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

    const neighborsForMovement = world.getNeighborsForMovement()
    const result = initShortestPathResult()
    const queue: QueueItem[] = [{ coordinate: origin, movementPoints: 0, path: [] }]
    let current: QueueItem | undefined

    while ((current = queue.shift())) {
        for (const [neighbor, cost] of neighborsForMovement[current.coordinate[COLUMN]]![
            current.coordinate[ROW]
        ]) {
            const movementPoints =
                current.movementPoints + cost + additionalMovementCost(world, neighbor)
            const path = [...current.path, neighbor]
            const previousResult = result[neighbor[COLUMN]]![neighbor[ROW]]

            if (
                (previousResult && previousResult.movementPoints <= movementPoints) ||
                movementPoints > maximum
            ) {
                continue
            }

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

        result[origin[COLUMN]]![origin[ROW]] = { path: [], movementPoints: 0 }
        return result
    }
}
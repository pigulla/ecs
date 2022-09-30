import type { IWorld } from '../../ecs'
import type { Coordinate } from '../../framework/geometry'
import { COLUMN, ROW } from '../../framework/geometry'

import { additionalMovementCost } from './additional-movement-cost'
import { Fact } from './fact'
import { AdjacentMovement } from './graph'

interface Result {
    path: Coordinate[]
    movementPoints: number
}

export function shortestPaths(
    world: IWorld<Fact>,
    origin: Coordinate,
    maximum: number = Number.POSITIVE_INFINITY,
): (Result | null)[][] {
    interface QueueItem {
        coordinate: Coordinate
        movementPoints: number
        path: Coordinate[]
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
        const rows = world.getFact<number>(Fact.ROWS)
        const columns = world.getFact<number>(Fact.COLUMNS)

        const result = Array.from({ length: columns }).map(() =>
            Array.from<Result | null>({ length: rows }).fill(null),
        )

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result[origin[COLUMN]]![origin[ROW]] = { path: [], movementPoints: 0 }
        return result
    }
}

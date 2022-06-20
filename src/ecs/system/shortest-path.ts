import type { Coordinate } from '../geometry'
import { COLUMN, isSameCoordinate, ROW } from '../geometry'
import type { IWorld } from '../world.interface'

import { additionalMovementCost } from './additional-movement-cost'

interface Result {
    path: Readonly<Coordinate>[]
    movementPoints: number
}

function getAdditionalCost(
    cache: Record<string, number>,
    world: IWorld,
    location: Readonly<Coordinate>,
): number {
    const index = location.join(':')

    if (cache[index] === undefined) {
        cache[index] = additionalMovementCost(world, location)
    }

    return cache[index]!
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

    const result = initShortestPathResult()
    const queue: QueueItem[] = [{ coordinate: origin, movementPoints: 0, path: [] }]
    let current: QueueItem | undefined

    while ((current = queue.shift())) {
        for (const [neighbor, cost] of world.getNeighborsForMovement(current.coordinate)) {
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

type ShortestPath = { coordinates: Readonly<Coordinate>; step: number; total: number }[]

export function shortestPath(
    world: IWorld,
    origin: Readonly<Coordinate>,
    destination: Readonly<Coordinate>,
): ShortestPath | null {
    interface ShortestPathToSquare {
        path: Readonly<Coordinate>[]
        total: number
        step: number
    }

    interface QueueItem {
        coordinate: Readonly<Coordinate>
        total: number
        path: Readonly<Coordinate>[]
    }

    const additionalCostCache: Record<string, number> = {}
    const result = initShortestPathResult()
    const queue: QueueItem[] = [{ coordinate: origin, total: 0, path: [] }]
    let current: QueueItem | undefined
    let shortestSoFar = Number.POSITIVE_INFINITY

    while ((current = queue.shift())) {
        if (isSameCoordinate(destination, current.coordinate)) {
            shortestSoFar = Math.min(current.total, shortestSoFar)
        }

        for (const [neighbor, cost] of world.getNeighborsForMovement(current.coordinate)) {
            const step = cost + getAdditionalCost(additionalCostCache, world, neighbor)
            const total = current.total + step
            const path = [...current.path, neighbor]
            const previousResult = result[neighbor[COLUMN]]![neighbor[ROW]]

            if ((previousResult && previousResult.total <= total) || total >= shortestSoFar) {
                continue
            }

            result[neighbor[COLUMN]]![neighbor[ROW]] = {
                path,
                total,
                step,
            }
            queue.push({
                path,
                total,
                coordinate: neighbor,
            })
        }
    }

    return (
        result[destination[COLUMN]]![destination[ROW]]?.path.map(coordinates => ({
            coordinates,
            step: result[coordinates[COLUMN]]![coordinates[ROW]]!.step,
            total: result[coordinates[COLUMN]]![coordinates[ROW]]!.total,
        })) ?? null
    )

    function initShortestPathResult(): (ShortestPathToSquare | null)[][] {
        const result = Array.from({ length: world.columns }).map(() =>
            Array.from<ShortestPathToSquare | null>({ length: world.rows }).fill(null),
        )

        result[origin[COLUMN]]![origin[ROW]] = { path: [], total: 0, step: 0 }
        return result
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

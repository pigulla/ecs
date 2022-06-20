export enum Direction {
    NORTH = 'N',
    NORTH_EAST = 'NE',
    EAST = 'E',
    SOUTH_EAST = 'SE',
    SOUTH = 'S',
    SOUTH_WEST = 'SW',
    WEST = 'W',
    NORTH_WEST = 'NW',
}

const diagonalDirections = new Set([
    Direction.NORTH_WEST,
    Direction.NORTH_EAST,
    Direction.SOUTH_WEST,
    Direction.SOUTH_EAST,
])

export function isDiagonal(direction: Direction): boolean {
    return diagonalDirections.has(direction)
}

export const directionDelta: Record<Direction, [number, number]> = {
    [Direction.NORTH_WEST]: [-1, -1],
    [Direction.WEST]: [-1, +0],
    [Direction.SOUTH_WEST]: [-1, +1],
    [Direction.NORTH]: [+0, -1],
    [Direction.SOUTH]: [+0, +1],
    [Direction.NORTH_EAST]: [+1, -1],
    [Direction.EAST]: [+1, +0],
    [Direction.SOUTH_EAST]: [+1, +1],
}

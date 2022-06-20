export const COLUMN = 0
export const ROW = 1

export type Coordinate = [number, number]

export function isSameCoordinate(a: Readonly<Coordinate>, b: Readonly<Coordinate>): boolean {
    return a[COLUMN] === b[COLUMN] && a[ROW] === b[ROW]
}

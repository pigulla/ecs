export const COLUMN = 0
export const ROW = 1

export type Coordinate = Readonly<[number, number]>

export interface Dimensions {
    readonly columns: number
    readonly rows: number
}

export function isSameCoordinate(a: Coordinate, b: Coordinate): boolean {
    return a[COLUMN] === b[COLUMN] && a[ROW] === b[ROW]
}

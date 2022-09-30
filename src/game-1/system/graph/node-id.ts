import type { Coordinate } from '../../../framework/geometry'
import { COLUMN, ROW } from '../../../framework/geometry'

export function nodeId(coordinate: Coordinate): string {
    return `${coordinate[COLUMN]}:${coordinate[ROW]}`
}

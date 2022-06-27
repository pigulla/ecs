import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'

export function nodeId(coordinate: Coordinate): string {
    return `${coordinate[COLUMN]}:${coordinate[ROW]}`
}

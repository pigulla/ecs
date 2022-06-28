import type { Opaque } from 'type-fest'

import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'

export type NodeId = Opaque<string, 'node-id'>

export function nodeId(coordinate: Coordinate): NodeId {
    return `${coordinate[COLUMN]}:${coordinate[ROW]}` as NodeId
}

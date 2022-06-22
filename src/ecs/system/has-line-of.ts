import type { ObstructionType } from '../component'
import { Obstruction, OrthogonalLine } from '../component'
import type { Coordinate, Line } from '../geometry'
import { intersects, COLUMN, ROW } from '../geometry'
import type { IWorld } from '../world.interface'

export function hasLineOf(
    world: IWorld,
    from: Readonly<Coordinate>,
    to: Readonly<Coordinate>,
    blockedBy: Iterable<ObstructionType>,
): boolean {
    const los: Line = [
        [from[COLUMN] + 0.5, from[ROW] + 0.5],
        [to[COLUMN] + 0.5, to[ROW] + 0.5],
    ]

    return world
        .findEntities([Obstruction, OrthogonalLine], [])
        .filter(entity => entity.getComponent(Obstruction).blocksAny(blockedBy))
        .map(entity => entity.getComponent(OrthogonalLine))
        .every(line => !intersects(los, [line.from, line.to]))
}

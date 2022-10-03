import type { IWorld, Signal } from '../../../ecs'
import { COLUMN, ROW } from '../../../framework/geometry'
import { Location } from '../../component'
import { playerTag } from '../../tag'
import { Fact } from '../fact'
import { gameEndSignal } from '../signal'

export function wallCollision(world: IWorld<Fact>, _signals: ReadonlySet<Signal>): void {
    const player = world.getEntity([Location], [playerTag])
    const { coordinates } = world.getComponent(player, Location)
    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)

    if (
        coordinates[ROW] < 0 ||
        coordinates[COLUMN] < 0 ||
        coordinates[ROW] >= rows ||
        coordinates[COLUMN] >= columns
    ) {
        world.signal(gameEndSignal)
    }
}

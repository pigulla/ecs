import type { IWorld, Signal } from '../../../ecs'
import { COLUMN, ROW } from '../../../framework/geometry'
import { Location } from '../../component'
import { Fact } from '../../fact'
import { GAME_OVER } from '../../signal'
import { PLAYER } from '../../tag'

export function wallCollision(world: IWorld<Fact>, _signals: ReadonlySet<Signal>): void {
    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)
    const player = world.findEntity([Location], [PLAYER])

    if (player === null) {
        return
    }

    const { coordinates } = world.getComponent(player, Location)

    if (
        coordinates[ROW] < 0 ||
        coordinates[COLUMN] < 0 ||
        coordinates[ROW] >= rows ||
        coordinates[COLUMN] >= columns
    ) {
        world.signal(GAME_OVER)
    }
}

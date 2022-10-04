import type { IWorld, Signal } from '../../../ecs'
import { Fire, Location } from '../../component'
import type { Fact } from '../../fact'
import { GAME_OVER } from '../../signal'
import { PLAYER } from '../../tag'

export function fireCollision(world: IWorld<Fact>, _signals: ReadonlySet<Signal>): void {
    const player = world.findEntity([Location], [PLAYER])

    if (player === null) {
        return
    }

    const playerLocation = world.getComponent(player, Location)

    for (const entity of world.findEntities([Fire])) {
        const location = world.getComponent(entity, Location)
        if (location.equals(playerLocation)) {
            world.signal(GAME_OVER)
        }
    }
}

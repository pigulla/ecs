import type { IWorld, Signal } from '../../../ecs'
import type { Fact } from '../../fact'
import { SPAWN_FIRE } from '../../signal'

const spawnProbability = 0.2

export function fireSpawnTrigger(world: IWorld<Fact>, _signals: ReadonlySet<Signal>): void {
    if (Math.random() <= spawnProbability) {
        world.signal(SPAWN_FIRE)
    }
}

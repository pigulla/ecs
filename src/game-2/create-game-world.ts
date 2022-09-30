import type { IWorld } from '../ecs'
import { createWorld } from '../framework'

import { Direction, Location, Movement, Visual } from './component'
import { ChangeDirectionStepTrigger } from './component/change-direction.step-trigger'
import type { Fact } from './system/fact'
import { playerTag } from './tag'

export function createGameWorld(): IWorld<Fact> {
    const world = createWorld<Fact>({ rows: 25, columns: 40 })

    const agent1 = world.createEntity({ name: 'agent-1' })
    world.setComponent(agent1, new Visual({ color: [255, 0, 0] }))
    world.setComponent(agent1, new Location({ coordinates: [5, 5] }))
    world.setComponent(agent1, new Movement({ direction: Direction.UP, bounce: true }))
    world.setComponent(agent1, new ChangeDirectionStepTrigger({ triggerAtStep: 5 }))

    const agent2 = world.createEntity({ name: 'agent-2' })
    world.setComponent(agent2, new Visual({ color: [255, 0, 255] }))
    world.setComponent(agent2, new Location({ coordinates: [15, 5] }))
    world.setComponent(agent2, new Movement({ direction: Direction.RIGHT, bounce: true }))

    const player = world.createEntity({ name: 'player' })
    world.addTag(player, playerTag)
    world.setComponent(player, new Visual({ color: [0, 0, 0] }))
    world.setComponent(player, new Location({ coordinates: [20, 20] }))

    return world
}

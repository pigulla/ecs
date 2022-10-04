/* eslint-disable @typescript-eslint/no-unused-vars */

import type { IWorld, Signal } from '../../../ecs'
import { Fire, Location, neighbor } from '../../component'
import { createFireEntity } from '../../entity/fire'
import { Fact } from '../../fact'

export function fireMovement(world: IWorld<Fact>, _signals: ReadonlySet<Signal>): void {
    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)

    for (const entity of world.findEntities([Fire, Location])) {
        const fire = world.getComponent(entity, Fire)
        const location = world.getComponent(entity, Location)
        let nextLocation: Location | null = null

        if (fire.intensity <= 1) {
            world.removeEntity(entity)
            continue
        }

        if (fire.intensity === Fire.MAX_INTENSITY) {
            nextLocation = neighbor(location, fire.direction)
            if (nextLocation.isInBounds({ rows, columns })) {
                createFireEntity(
                    world,
                    nextLocation,
                    new Fire({ intensity: fire.intensity, direction: fire.direction }),
                )
            }
        }

        fire.intensity -= 1
    }
}

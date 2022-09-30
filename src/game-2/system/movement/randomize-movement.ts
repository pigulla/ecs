import type { IWorld } from '../../../ecs'
import { Direction, Movement, ChangeDirectionStepTrigger } from '../../component'
import type { Fact } from '../fact'

const inverse: Record<Direction, Direction> = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
}

function randomDirection(current: Direction): Direction {
    const values = Object.values(Direction).filter(
        direction => current !== direction && direction !== inverse[current],
    )

    return values[Math.floor(Math.random() * values.length)]
}

export function randomizeMovement(world: IWorld<Fact>): void {
    for (const entity of world.findEntities([ChangeDirectionStepTrigger, Movement])) {
        const { triggerAtStep } = world.getComponent(entity, ChangeDirectionStepTrigger)
        const { direction, bounce } = world.getComponent(entity, Movement)

        if (world.currentStep === triggerAtStep) {
            const triggerNextAtStep = world.currentStep + Math.floor(Math.random() * 10) + 5
            world.setComponent(
                entity,
                new Movement({ direction: randomDirection(direction), bounce }),
            )
            world.setComponent(
                entity,
                new ChangeDirectionStepTrigger({ triggerAtStep: triggerNextAtStep }),
            )
        }
    }
}

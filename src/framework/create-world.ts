import type { IWorld } from '../ecs'
import { World } from '../ecs'

export function createWorld<T extends string>(facts: Record<T, unknown>): IWorld<T> {
    return new World(
        document,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.querySelector('#ecs')!,
        facts,
    )
}

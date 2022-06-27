import type { Signal } from './signal'
import type { IReadonlyWorld } from './world.interface'

export abstract class GlobalState {
    protected readonly world: IReadonlyWorld

    protected constructor(world: IReadonlyWorld) {
        this.world = world
    }

    public onStepStart(_signals: ReadonlySet<Signal>): void {
        // empty default implementation
    }
}

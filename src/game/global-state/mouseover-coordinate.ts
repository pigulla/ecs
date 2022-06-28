import type { IReadonlyWorld } from '../../ecs'
import { GlobalState, createSignal } from '../../ecs'
import type { Coordinate } from '../geometry'
import { isSameCoordinate } from '../geometry'

export const MOUSE_COORDINATE_CHANGED = createSignal('mouse-coordinate-changed')

export abstract class MouseoverCoordinate extends GlobalState {
    private current: Coordinate | null

    public constructor(world: IReadonlyWorld) {
        super(world)

        this.current = null
    }

    public set(coordinate: Coordinate | null): void {
        if (
            (coordinate === null && this.current === null) ||
            (coordinate && this.current && isSameCoordinate(coordinate, this.current))
        ) {
            return
        }

        this.current = coordinate
        this.world.signalNextFrame(MOUSE_COORDINATE_CHANGED)
    }

    public get(): Coordinate | null {
        return this.current
    }
}

export class Origin extends MouseoverCoordinate {}

export class Destination extends MouseoverCoordinate {}

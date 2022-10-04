import { Component } from '../../ecs'
import type { Direction } from '../direction'

export class Movement extends Component {
    public readonly direction: Direction

    public constructor(data: { direction: Direction }) {
        super()

        this.direction = data.direction
    }
}

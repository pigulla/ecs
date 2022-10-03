import { Component } from '../../ecs'

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
}

export class Movement extends Component {
    public readonly direction: Direction

    public constructor(data: { direction: Direction }) {
        super()

        this.direction = data.direction
    }
}

import { Component } from '../../ecs'

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
}

export class Movement extends Component {
    public readonly direction: Direction
    public readonly bounce: boolean

    public constructor(data: { direction: Direction; bounce: boolean }) {
        super()

        this.direction = data.direction
        this.bounce = data.bounce
    }
}

import { Component } from '../../ecs'

export interface VisualOptions {
    color: [number, number, number, number]
}

export class Visual extends Component {
    public readonly color: readonly [number, number, number, number]

    public constructor(data: VisualOptions) {
        super()

        this.color = data.color
    }
}

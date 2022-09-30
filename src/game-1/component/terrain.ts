import { Component } from '../../ecs'

export class Terrain extends Component {
    public readonly additionalMovementPoints: number

    public constructor(data: { additionalMovementPoints: number }) {
        super()

        this.additionalMovementPoints = data.additionalMovementPoints
    }
}

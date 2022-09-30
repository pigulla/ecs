import { Component } from '../../ecs'
import type { Coordinate } from '../../framework/geometry'

export class Location extends Component {
    public readonly coordinates: Coordinate

    public constructor(data: { coordinates: Coordinate }) {
        super()

        this.coordinates = [...data.coordinates]
    }
}

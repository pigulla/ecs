import { Component } from '../../ecs'
import type { Coordinate } from '../../framework/geometry'

export class Location extends Component {
    public readonly coordinates: Coordinate

    public constructor(data: { coordinates: Coordinate }) {
        super()

        this.coordinates = [...data.coordinates]
    }
    public equals(other: Location): boolean {
        return (
            this.coordinates[0] === other.coordinates[0] &&
            this.coordinates[1] === other.coordinates[1]
        )
    }
}

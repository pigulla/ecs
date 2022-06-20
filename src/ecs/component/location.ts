import type { Coordinate } from '../geometry'
import { isSameCoordinate } from '../geometry'

import { Component } from './component'

export class Location extends Component {
    public coordinates: Readonly<Coordinate>

    public constructor(data: { coordinates: Coordinate }) {
        super()

        this.coordinates = [...data.coordinates]
    }

    public equals(other: Location): boolean {
        return isSameCoordinate(this.coordinates, other.coordinates)
    }
}

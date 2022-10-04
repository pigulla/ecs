import { Component } from '../../ecs'
import type { Coordinate } from '../../framework/geometry'
import { COLUMN, ROW } from '../../framework/geometry'
import { Direction } from '../direction'

export class Location extends Component {
    public readonly coordinates: Coordinate

    public constructor(data: { coordinates: Coordinate }) {
        super()

        this.coordinates = [...data.coordinates]
    }

    public equals(other: Location): boolean {
        return (
            this.coordinates[COLUMN] === other.coordinates[COLUMN] &&
            this.coordinates[ROW] === other.coordinates[ROW]
        )
    }

    public isInBounds({ rows, columns }: { rows: number; columns: number }): boolean {
        return (
            this.coordinates[ROW] >= 0 &&
            this.coordinates[COLUMN] >= 0 &&
            this.coordinates[ROW] < rows &&
            this.coordinates[COLUMN] < columns
        )
    }
}

export function neighbor(location: Location, direction: Direction): Location {
    const [column, row] = location.coordinates

    switch (direction) {
        case Direction.RIGHT: {
            return new Location({ coordinates: [column + 1, row] })
        }
        case Direction.LEFT: {
            return new Location({ coordinates: [column - 1, row] })
        }
        case Direction.UP: {
            return new Location({ coordinates: [column, row - 1] })
        }
        case Direction.DOWN: {
            return new Location({ coordinates: [column, row + 1] })
        }
    }
}

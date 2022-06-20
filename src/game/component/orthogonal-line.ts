import { Component } from '../../ecs'
import type { Coordinate } from '../geometry'
import { COLUMN, ROW } from '../geometry'

export class OrthogonalLine extends Component {
    public readonly from: Coordinate
    public readonly to: Coordinate

    public constructor(data: { from: Coordinate; to: Coordinate }) {
        super()

        this.from = [...data.from]
        this.to = [...data.to]

        this.validate()
    }

    private validate(): void {
        if (this.from[COLUMN] === this.to[COLUMN] && this.from[ROW] === this.to[ROW]) {
            throw new Error('line length is zero')
        }

        if (this.from[COLUMN] !== this.to[COLUMN] && this.from[ROW] !== this.to[ROW]) {
            throw new Error('line is not orthogonal')
        }
    }

    public equals(other: OrthogonalLine): boolean {
        return (
            this.from[COLUMN] === other.from[COLUMN] &&
            this.from[ROW] === other.from[ROW] &&
            this.to[COLUMN] === other.to[COLUMN] &&
            this.to[ROW] === other.to[ROW]
        )
    }
}

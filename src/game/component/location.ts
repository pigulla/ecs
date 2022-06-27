import type { Tag } from '../../ecs'
import { Component, createTag } from '../../ecs'
import type { Coordinate } from '../geometry'

export function coordinateTag(coordinate: Coordinate): Tag {
    return createTag(`location-${coordinate.join('_')}`)
}

export class Location extends Component {
    public readonly coordinates: Coordinate
    public readonly tag: Tag

    public constructor(data: { coordinates: Coordinate }) {
        super()

        this.coordinates = [...data.coordinates]
        this.tag = coordinateTag(this.coordinates)
    }
}

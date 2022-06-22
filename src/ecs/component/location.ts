import type { Coordinate } from '../geometry'

import { Component } from './component'
import type { Tag } from './tag'
import { createTag } from './tag'

export function coordinateTag(coordinate: Readonly<Coordinate>): Tag {
    return createTag(`location-${coordinate.join('_')}`)
}

export class Location extends Component {
    public readonly coordinates: Readonly<Coordinate>
    public readonly tag: Tag

    public constructor(data: { coordinates: Coordinate }) {
        super()

        this.coordinates = [...data.coordinates]
        this.tag = coordinateTag(this.coordinates)
    }
}

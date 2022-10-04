import { Component } from '../../ecs'
import type { Direction } from '../direction'

export class Fire extends Component {
    public static readonly MAX_INTENSITY = 5
    public intensity: number
    public direction: Direction

    public constructor(data: { intensity: number; direction: Direction }) {
        super()

        if (data.intensity > Fire.MAX_INTENSITY || data.intensity < 0) {
            throw new Error(`Invalid intensity: ${data.intensity}`)
        }

        this.intensity = data.intensity
        this.direction = data.direction
    }
}

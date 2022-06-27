import { Component } from './component'

export interface VisualOptions {
    zIndex?: number
    strokeStyle?: string | null
    fillStyle?: string | null
    lineWidth?: number | null
    lineDash?: number[] | null
}

export class Visual extends Component {
    public readonly zIndex: number
    public readonly strokeStyle: string | null
    public readonly fillStyle: string | null
    public readonly lineDash: readonly number[] | null
    public readonly lineWidth: number | null

    public constructor(data: VisualOptions) {
        super()

        this.zIndex = data.zIndex ?? 0
        this.strokeStyle = data.strokeStyle ?? null
        this.fillStyle = data.fillStyle ?? null
        this.lineDash = data.lineDash ? [...data.lineDash] : null
        this.lineWidth = data.lineWidth ?? null
    }
}

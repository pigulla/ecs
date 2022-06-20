import { Component } from './component'

export interface VisualOptions {
    zIndex?: number
    strokeStyle?: string | null
    fillStyle?: string | null
    lineWidth?: number | null
    lineDash?: number[] | null
}

export class Visual extends Component {
    public zIndex: number
    public strokeStyle: string | null
    public fillStyle: string | null
    public lineDash: readonly number[] | null
    public lineWidth: number | null

    public constructor(data: VisualOptions) {
        super()

        this.zIndex = data.zIndex ?? 0
        this.strokeStyle = data.strokeStyle ?? null
        this.fillStyle = data.fillStyle ?? null
        this.lineDash = data.lineDash ?? null
        this.lineWidth = data.lineWidth ?? null
    }
}

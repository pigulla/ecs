import type { ICanvas } from './canvas.interface'

export class Canvas implements ICanvas {
    private readonly container: HTMLDivElement

    public constructor(container: HTMLDivElement) {
        this.container = container
    }

    public create(
        data: {
            classes?: string[]
            styles?: Partial<CSSStyleDeclaration>
        } = {},
    ): CanvasRenderingContext2D {
        const classes = data.classes ?? []
        const styles = data.styles ?? {}

        const canvas: HTMLCanvasElement = document.createElement('canvas')
        canvas.width = this.container.offsetWidth
        canvas.height = this.container.offsetHeight
        canvas.classList.add(...classes)

        Object.assign(canvas.style, styles)

        this.container.append(canvas)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return canvas.getContext('2d')!
    }

    public resize(dimensions: { width: number; height: number }): this {
        this.container.style.width = `${dimensions.width}px`
        this.container.style.height = `${dimensions.height}px`

        for (const canvas of this.container.querySelectorAll<HTMLCanvasElement>('canvas')) {
            canvas.width = dimensions.width
            canvas.height = dimensions.height
        }

        return this
    }
}

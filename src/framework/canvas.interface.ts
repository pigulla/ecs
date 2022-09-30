export interface ICanvas {
    create(data?: {
        classes?: string[]
        styles?: Partial<CSSStyleDeclaration>
    }): CanvasRenderingContext2D
    resize(dimensions: { width: number; height: number }): this
}

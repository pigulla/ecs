export interface IControl {
    onMouseMove(callback: (event: MouseEvent) => void): this
    onKeyDown(callback: (event: KeyboardEvent) => void): this
}

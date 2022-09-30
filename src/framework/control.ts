import type { IControl } from './control.interface'

export class Control implements IControl {
    private readonly document: Document

    public constructor(document: Document) {
        this.document = document
    }

    public onKeyDown(callback: (event: KeyboardEvent) => void): this {
        this.document.addEventListener('keydown', callback)
        return this
    }

    public onMouseMove(callback: (event: MouseEvent) => void): this {
        this.document.addEventListener('mousemove', callback)
        return this
    }
}

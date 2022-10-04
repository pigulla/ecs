import { clear } from './util'

interface Options {
    cellSizePx: number
    rows: number
    columns: number
}

const color = {
    background: 'rgba(255, 255, 255, 1.0)',
    grid: 'rgba(0, 0, 0, 0.5)',
}

export function renderGrid(
    { columns, rows, cellSizePx }: Options,
    ctx: CanvasRenderingContext2D,
): void {
    ctx.save()
    ctx.lineWidth = 1
    ctx.setLineDash([])

    clear({ width: columns * cellSizePx, height: rows * cellSizePx }, ctx, color.background)

    ctx.strokeStyle = color.grid
    ctx.setLineDash([1, 2])

    for (let row = 1; row < rows; row++) {
        ctx.beginPath()
        ctx.moveTo(0, row * cellSizePx)
        ctx.lineTo(columns * cellSizePx, row * cellSizePx)
        ctx.stroke()
    }

    for (let column = 1; column < columns; column++) {
        ctx.beginPath()
        ctx.moveTo(column * cellSizePx, 0)
        ctx.lineTo(column * cellSizePx, rows * cellSizePx)
        ctx.stroke()
    }

    ctx.restore()
}

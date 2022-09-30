import { clear } from './util'

interface Options {
    cellSizePx: number
    rows: number
    columns: number
}

const color = {
    background: 'rgba(255, 255, 255, 1.0)',
    grid: 'rgba(0, 0, 0, 0.5)',
    outsideBox: 'rgba(0, 0, 0, 1.0)',
    coordinates: 'rgba(0, 0, 0, 0.25)',
    outsideCoordinates: 'rgba(0, 0, 0, 0.5)',
    wall: 'rgba(0, 0, 0, 1.0)',
    door: 'rgb(255, 127, 0, 1.0)',
    window: 'rgb(0, 96, 192, 1.0)',
}

function renderGrid({ cellSizePx, rows, columns }: Options, ctx: CanvasRenderingContext2D): void {
    ctx.save()

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

export function renderBackground(options: Options, ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 1
    ctx.setLineDash([])

    clear(
        { width: options.columns * options.cellSizePx, height: options.rows * options.cellSizePx },
        ctx,
        color.background,
    )
    renderGrid(options, ctx)
}

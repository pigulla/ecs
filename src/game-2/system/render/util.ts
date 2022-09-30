export function clear(
    { width, height }: { width: number; height: number },
    ctx: CanvasRenderingContext2D,
    backgroundColor?: string,
): void {
    ctx.clearRect(0, 0, width, height)

    if (backgroundColor) {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
    }
}

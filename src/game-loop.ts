export function startGameLoop(draw: (fps: number) => void): void {
    const SAMPLES = 30 * 3
    const slidingWindowFps = Array.from<number>({ length: SAMPLES }).fill(0)
    let frame = 0
    let previous: DOMHighResTimeStamp

    function gameLoop(time: DOMHighResTimeStamp): void {
        const delta = time - previous
        const fps = 1 / (delta / 1000)
        previous = time
        frame++

        slidingWindowFps[frame % SAMPLES] = fps
        const average = slidingWindowFps.reduce((sum, n) => sum + n, 0) / SAMPLES

        draw(average)

        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
}

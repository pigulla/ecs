export function startGameLoop(callback: (time: number, fps: number) => void): void {
    const SAMPLES = 30 * 3
    const slidingWindowFps = Array.from<number>({ length: SAMPLES }).fill(0)
    const start = performance.now()

    let frame = 0
    let previous: DOMHighResTimeStamp

    function gameLoop(time: DOMHighResTimeStamp): void {
        const delta = time - previous
        const fps = 1 / (delta / 1000)

        previous = time
        frame++

        slidingWindowFps[frame % SAMPLES] = fps
        const average =
            // Not sure what's up with Infinity here, but CBA to fix it.
            slidingWindowFps.filter(v => Number.isFinite(v)).reduce((sum, n) => sum + n, 0) /
            SAMPLES

        callback(time - start, average)

        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
}

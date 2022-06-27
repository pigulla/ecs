export function startGameLoop(callback: (time: number, fps: number) => void): void {
    const SAMPLE_COUNT = 30 * 3
    const slidingWindowFps = Array.from<number>({ length: SAMPLE_COUNT }).fill(0)
    let frame = 0
    let previous: DOMHighResTimeStamp

    function gameLoop(time: DOMHighResTimeStamp): void {
        const delta = time - previous
        const fps = 1 / (delta / 1000)
        previous = time
        frame++

        slidingWindowFps[frame % SAMPLE_COUNT] = fps
        const average = slidingWindowFps.reduce((sum, n) => sum + n, 0) / SAMPLE_COUNT

        callback(time, average)

        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
}

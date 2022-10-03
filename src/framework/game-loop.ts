import type { IGameLoop } from './game-loop.interface'

export function createGameLoop(callback: (time: number, fps: number) => void): IGameLoop {
    const SAMPLES = 30 * 3
    const slidingWindowFps = Array.from<number>({ length: SAMPLES }).fill(0)
    const start = performance.now()

    let id: number | null = null
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
        id = window.requestAnimationFrame(gameLoop)
    }

    return {
        start(): void {
            if (id === null) {
                id = window.requestAnimationFrame(gameLoop)
                console.log(`requesting animation frame ${id}`)
            }
        },
        stop(): void {
            if (id !== null) {
                console.log(`canceling animation frame ${id}`)
                window.cancelAnimationFrame(id)
                id = null
            }
        },
    }
}

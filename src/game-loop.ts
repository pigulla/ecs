import { exponentialWeightedMovingAverage } from './util'

export function startGameLoop(callback: (time: DOMHighResTimeStamp, fps: number) => void): void {
    const ewma = exponentialWeightedMovingAverage(60)
    let previous: DOMHighResTimeStamp = performance.now()

    function gameLoop(time: DOMHighResTimeStamp): void {
        const delta = time - previous
        const averageFps = ewma(delta)
        previous = time

        callback(time, averageFps)

        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
}

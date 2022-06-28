// See https://stackoverflow.com/questions/12636613/#answer-50854247

export type ExponentialWeightedMovingAverage = (value: number) => number

export function exponentialWeightedMovingAverage(factor: number): ExponentialWeightedMovingAverage {
    let average = 0
    let counter = 0

    return function (value: number): number {
        counter += 1
        average = average + (value - average) / Math.min(counter, factor)
        return average
    }
}

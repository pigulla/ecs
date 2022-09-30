import type { ICanvas, IControl } from '../framework'

import { createGameWorld } from './create-game-world'
import { run } from './run'

export function game1(canvas: ICanvas, control: IControl): void {
    run(createGameWorld(), canvas, control)
}

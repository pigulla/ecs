import type { ICanvas, IControl, IGameLoop } from '../framework'

import { createGameWorld } from './create-game-world'
import { run } from './run'

export function game1(canvas: ICanvas, control: IControl): IGameLoop {
    return run(createGameWorld(), canvas, control)
}

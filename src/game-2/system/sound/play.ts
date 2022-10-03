import type { IWorld, Signal } from '../../../ecs'
import type { Fact } from '../../fact'
import { foodCollectedSignal, gameOverSignal } from '../../signal'

const beep = new Audio('sound/beep.mp3')
const gameover = new Audio('sound/gameover.mp3')

export function sound(_world: IWorld<Fact>, signals: ReadonlySet<Signal>): void {
    /* eslint-disable @typescript-eslint/no-floating-promises */
    if (signals.has(foodCollectedSignal)) {
        beep.play()
    }
    if (signals.has(gameOverSignal)) {
        gameover.play()
    }
}

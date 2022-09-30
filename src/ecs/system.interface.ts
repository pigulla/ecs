import type { Signal } from './signal'
import type { IWorld } from './world.interface'

export type ISystem<Facts = never> = (world: IWorld<Facts>, signals: ReadonlySet<Signal>) => void

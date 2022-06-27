import type { Signal } from '../signal'
import type { IWorld } from '../world.interface'

export type ISystem = (world: IWorld, signals: ReadonlySet<Signal>) => void

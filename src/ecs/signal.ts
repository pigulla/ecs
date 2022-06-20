import type { Opaque } from 'type-fest'

export type Signal = Opaque<string, 'signal'>

export function signal(name: string): Signal {
    if (name.length === 0) {
        throw new TypeError('Signal name must not be empty')
    }

    return `🚩${name}` as Signal
}

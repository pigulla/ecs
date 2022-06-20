import type { Opaque } from 'type-fest'

export type Tag = Opaque<string, 'tag'>

export function isTag(value: string): value is Tag {
    return value.startsWith('🏷')
}

export function createTag(tag: string): Tag {
    if (!/^[\w-_]+$/i.test(tag)) {
        throw new TypeError(`Invalid tag '${tag}'`)
    }

    return `🏷️️${tag}` as Tag
}

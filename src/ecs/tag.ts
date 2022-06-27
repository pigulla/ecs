import type { Opaque } from 'type-fest'

export type Tag = Opaque<string, 'tag'>

export function createTag(tag: string): Tag {
    if (!/^[\w-_]+$/i.test(tag)) {
        throw new TypeError(`Invalid tag '${tag}'`)
    }

    return `🏷️️${tag}` as Tag
}

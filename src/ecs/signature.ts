import type { Class } from 'type-fest'

import type { Component, Tag } from './component'

export interface Signature {
    readonly components: ReadonlySet<Class<Component>>
    readonly tags: ReadonlySet<Tag>
}

export function signature({
    components,
    tags,
}: {
    components?: Iterable<Class<Component>>
    tags?: Iterable<Tag>
}): Signature {
    return {
        components: new Set(components),
        tags: new Set(tags),
    }
}

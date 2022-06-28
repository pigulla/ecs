import type { Opaque } from 'type-fest'

export type Entity = Opaque<string, 'entity'>

export function createEntity(id: number, name?: string): Entity {
    // TODO: Check that the name is allowed in a CSS class
    return `📂${id.toString(10)}${name ? `-${name}` : ''}` as Entity
}

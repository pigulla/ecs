import type { Entity } from '../entity'
import type { Tag } from '../tag'

export class TagAddedEvent extends Event {
    public static readonly NAME = 'tag-added'

    public readonly tag: Tag
    public readonly entity: Entity

    public constructor(tag: Tag, entity: Entity) {
        super(TagAddedEvent.NAME)

        this.tag = tag
        this.entity = entity
    }
}

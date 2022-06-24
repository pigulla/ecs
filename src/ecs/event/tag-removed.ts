import type { Tag } from '../component'
import type { Entity } from '../entity'

export class TagRemovedEvent extends Event {
    public static readonly NAME = 'tag-removed'

    public readonly tag: Tag
    public readonly entity: Entity

    public constructor(tag: Tag, entity: Entity) {
        super(TagRemovedEvent.NAME)

        this.tag = tag
        this.entity = entity
    }
}

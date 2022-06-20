import type { Entity } from '../entity'

export class EntityDeletedEvent extends Event {
    public static readonly NAME = 'entity-deleted'

    public readonly entity: Entity

    public constructor(entity: Entity) {
        super(EntityDeletedEvent.NAME)

        this.entity = entity
    }
}

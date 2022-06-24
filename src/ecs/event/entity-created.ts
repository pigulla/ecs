import type { Entity } from '../entity'

export class EntityCreatedEvent extends Event {
    public static readonly NAME = 'entity-created'

    public readonly entity: Entity

    public constructor(entity: Entity) {
        super(EntityCreatedEvent.NAME)

        this.entity = entity
    }
}

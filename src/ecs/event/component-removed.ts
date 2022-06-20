import type { Component } from '../component'
import type { Entity } from '../entity'

export class ComponentRemovedEvent extends Event {
    public static readonly NAME = 'component-removed'

    public readonly component: Component
    public readonly entity: Entity

    public constructor(component: Component, entity: Entity) {
        super(ComponentRemovedEvent.NAME)

        this.component = component
        this.entity = entity
    }
}

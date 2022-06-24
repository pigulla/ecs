import type { Component } from '../component'
import type { Entity } from '../entity'

export class ComponentAddedEvent extends Event {
    public static readonly NAME = 'component-added'

    public readonly component: Component
    public readonly entity: Entity

    public constructor(component: Component, entity: Entity) {
        super(ComponentAddedEvent.NAME)

        this.component = component
        this.entity = entity
    }
}

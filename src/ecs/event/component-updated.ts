import type { Component } from '../component'
import type { Entity } from '../entity'

export class ComponentUpdatedEvent<T extends Component> extends Event {
    public static readonly NAME = 'component-updated'

    public readonly newComponent: Component
    public readonly previousComponent: Component
    public readonly entity: Entity

    public constructor(newComponent: T, previousComponent: T, entity: Entity) {
        super(ComponentUpdatedEvent.NAME)

        this.newComponent = newComponent
        this.previousComponent = previousComponent
        this.entity = entity
    }
}

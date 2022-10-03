import type { Class } from 'type-fest'

import type { Component, ComponentType } from './component'
import type { Entity } from './entity'
import type {
    ComponentAddedEvent,
    ComponentRemovedEvent,
    ComponentUpdatedEvent,
    EntityCreatedEvent,
    EntityDeletedEvent,
    TagAddedEvent,
    TagRemovedEvent,
} from './event'
import type { Signal } from './signal'
import type { ISystem } from './system.interface'
import type { Tag } from './tag'

export interface IWorld<Facts = never> {
    readonly currentStep: number

    getFact<T>(key: Facts): T
    step(): void
    signal(signal: Signal): void

    addSystem(system: ISystem): void

    addTag(entity: Entity, tag: Tag): void
    removeTag(entity: Entity, tag: Tag): void

    getEntity(Classes: Iterable<Class<Component>>, tags?: Iterable<Tag>): Entity
    findEntities(Classes: Iterable<Class<Component>>, tags?: Iterable<Tag>): Entity[]
    createEntity(data?: { name?: string; parent?: Entity }): Entity
    removeEntity(entity: Entity): void

    findComponent<T extends Component>(
        entity: Entity,
        Class: Class<T>,
        tags?: Iterable<Tag>,
    ): T | null
    getComponent<T extends Component>(entity: Entity, Class: Class<T>, tags?: Iterable<Tag>): T
    getComponents(entity: Entity): Component[]
    setComponent<T extends Component>(entity: Entity, component: T): void
    removeComponent<T extends Component>(
        entity: Entity,
        component: T | Class<T> | ComponentType,
    ): void

    onTagAdded(callback: (event: TagAddedEvent) => void): void
    onTagRemoved(callback: (event: TagRemovedEvent) => void): void
    onEntityCreated(callback: (event: EntityCreatedEvent) => void): void
    onEntityDeleted(callback: (event: EntityDeletedEvent) => void): void
    onComponentAdded(callback: (event: ComponentAddedEvent) => void): void
    onComponentUpdated<T extends Component = Component>(
        callback: (event: ComponentUpdatedEvent<T>) => void,
    ): void
    onComponentRemoved(callback: (event: ComponentRemovedEvent) => void): void
}

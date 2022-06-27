import type { Class } from 'type-fest'

import type { Component, ComponentType, Tag } from './component'
import type { Entity } from './entity'
import type {
    ComponentAddedEvent,
    ComponentRemovedEvent,
    EntityCreatedEvent,
    EntityDeletedEvent,
    TagAddedEvent,
    TagRemovedEvent,
} from './event'
import type { Coordinate } from './geometry'
import type { Signal } from './signal'
import type { Signature } from './signature'
import type { ISystem } from './system'

export interface IWorld {
    readonly columns: number
    readonly rows: number

    step(): void
    signal(signal: Signal): void
    addSystem(system: ISystem): void
    getNeighborsForMovement(): [Coordinate, number][][][]
    addTag(entity: Entity, tag: Tag): void
    removeTag(entity: Entity, tag: Tag): void
    addComponent<T extends Component>(entity: Entity, component: T): void
    createEntity(data?: { name?: string; parent?: Entity }): Entity
    findEntities(Classes: Iterable<Class<Component>>, tags: Iterable<Tag>): Entity[]
    getComponent<T extends Component>(entity: Entity, Class: Class<T>): T
    getComponents(entity: Entity): Component[]
    removeComponent<T extends Component>(
        entity: Entity,
        component: T | Class<T> | ComponentType,
    ): void
    removeEntity(entity: Entity): void
    onTagAdded(callback: (event: TagAddedEvent) => void, signature?: Signature): void
    onTagRemoved(callback: (event: TagRemovedEvent) => void, signature?: Signature): void
    onEntityCreated(callback: (event: EntityCreatedEvent) => void, signature?: Signature): void
    onEntityDeleted(callback: (event: EntityDeletedEvent) => void, signature?: Signature): void
    onComponentAdded(callback: (event: ComponentAddedEvent) => void, signature?: Signature): void
    onComponentRemoved(
        callback: (event: ComponentRemovedEvent) => void,
        signature?: Signature,
    ): void
}

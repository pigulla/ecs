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
import type { GlobalState } from './global-state'
import type { Signal } from './signal'
import type { ISystem } from './system.interface'
import type { Tag } from './tag'

export interface IWorld {
    readonly columns: number
    readonly rows: number

    nextFrame(): void
    signalNextFrame(signal: Signal): void
    addGlobalState<T extends GlobalState>(globalState: T): void
    getGlobalState<T extends GlobalState>(Class: Class<T>): T
    addSystem(system: ISystem): void
    addTag(entity: Entity, tag: Tag): void
    removeTag(entity: Entity, tag: Tag): void
    setComponent<T extends Component>(entity: Entity, component: T): void
    createEntity(data?: { name?: string; parent?: Entity }): Entity
    findComponents<T extends Component>(Class: Class<T>): T[]
    findEntities(Classes: Iterable<Class<Component>>, tags: Iterable<Tag>): Entity[]
    getSingletonComponent<T extends Component>(Class: Class<T>): T
    getComponentOf<T extends Component>(entity: Entity, Class: Class<T>): T
    getComponents(entity: Entity): Component[]
    removeComponent<T extends Component>(
        entity: Entity,
        component: T | Class<T> | ComponentType,
    ): void
    removeEntity(entity: Entity): void
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

export type IReadonlyWorld = Pick<
    IWorld,
    | 'rows'
    | 'columns'
    | 'signalNextFrame'
    | 'getGlobalState'
    | 'findEntities'
    | 'findComponents'
    | 'getSingletonComponent'
    | 'getComponents'
    | 'getComponentOf'
    | 'onTagAdded'
    | 'onTagRemoved'
    | 'onComponentRemoved'
    | 'onComponentAdded'
    | 'onComponentUpdated'
    | 'onEntityCreated'
    | 'onEntityDeleted'
>

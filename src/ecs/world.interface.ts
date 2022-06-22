import type { Class } from 'type-fest'

import type { Component, Tag } from './component'
import type { Entity } from './entity'
import type { Coordinate } from './geometry'

export interface IWorld {
    readonly columns: number
    readonly rows: number

    updateNeighborsForMovement(): void
    getNeighborsForMovement(
        coordinate: Readonly<Coordinate>,
    ): readonly [Readonly<Coordinate>, number][]
    addTag(entity: Entity, tag: Tag): void
    addComponent<T extends Component>(entity: Entity, component: T): void
    createEntity(data?: { name?: string; parent?: Entity }): Entity
    findEntities(Classes: Iterable<Class<Component>>, tags: Iterable<Tag>): Entity[]
    getComponent<T extends Component>(entity: Entity, Class: Class<T>): T
    getComponents(entity: Entity): Component[]
    removeComponent<T extends Component>(entity: Entity, component: T | Class<T>): void
    removeEntity(entity: Entity): void
}

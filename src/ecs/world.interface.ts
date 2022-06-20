import type { Class } from 'type-fest'

import type { Component } from './component'
import type { Entity } from './entity'
import type { Coordinate } from './geometry'

export interface IWorld {
    readonly columns: number
    readonly rows: number

    updateNeighborsForMovement(): void
    getNeighborsForMovement(
        coordinate: Readonly<Coordinate>,
    ): readonly [Readonly<Coordinate>, number][]
    addComponent<T extends Component>(entity: Entity, component: T): void
    createEntity(data?: { name?: string; parent?: Entity }): Entity
    findComponent<T extends Component>(entity: Entity, Class: Class<T>): T | null
    findEntities(Classes: Iterable<Class<Component>>): Entity[]
    getComponent<T extends Component>(entity: Entity, Class: Class<T>): T
    getComponents(entity: Entity): Component[]
    registerComponentType(Class: Class<Component>): void
    registerComponentTypes(...Classes: Class<Component>[]): void
    removeComponent<T extends Component>(entity: Entity, component: T | Class<T>): void
    removeEntity(entity: Entity): void
}

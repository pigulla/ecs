/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Class } from 'type-fest'

import type { Component, Tag } from '../component'
import type { IWorld } from '../world.interface'

export class Entity {
    public readonly element: HTMLDivElement
    public readonly id: number
    public readonly name: string

    private readonly world: IWorld

    public constructor(world: IWorld, id: number, element: HTMLDivElement) {
        this.world = world
        this.element = element

        this.id = id
        this.name = this.element.title
    }

    public get components(): readonly Component[] {
        return this.world.getComponents(this)
    }

    public addTag(tag: Tag): this {
        this.world.addTag(this, tag)
        return this
    }

    public getComponent<T extends Component>(Class: Class<T>): T {
        return this.world.getComponent(this, Class)
    }

    public addComponent<T extends Component>(component: T): this {
        this.world.addComponent(this, component)
        return this
    }

    public removeComponent<T extends Component>(component: T): this {
        this.world.removeComponent(this, component)
        return this
    }
}

/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-non-null-assertion */
import type { Class, SetRequired } from 'type-fest'

import type { ComponentType, Tag } from './component'
import { Component, isComponentType, ObstructionType } from './component'
import { Entity } from './entity'
import {
    ComponentAddedEvent,
    ComponentRemovedEvent,
    EntityCreatedEvent,
    EntityDeletedEvent,
    TagAddedEvent,
    TagRemovedEvent,
} from './event'
import type { Coordinate } from './geometry'
import { COLUMN, ROW } from './geometry'
import { hasLineOf } from './system'
import type { IWorld } from './world.interface'

const ECS_PROPERTIES = '--ecs-properties'

type EcsStyleSheetUninitialized = CSSStyleSheet &
    Element & {
        [ECS_PROPERTIES]?: Map<Entity, Component>
    }
type EcsStyleSheet = SetRequired<EcsStyleSheetUninitialized, typeof ECS_PROPERTIES>

const ENTITY_REF = Symbol('entity-reference')

type ElementWithEntityRef = HTMLDivElement & { [ENTITY_REF]: Entity }

export class World implements IWorld {
    public readonly columns: number
    public readonly rows: number

    private readonly document: Document
    private readonly root: Element
    private readonly entities: ShadowRoot
    private nextEntityId: number

    public constructor(document: Document, root: Element, data: { rows: number; columns: number }) {
        this.columns = data.columns
        this.rows = data.rows
        this.document = document
        this.root = root

        this.entities = this.root.attachShadow({ mode: 'closed' })
        this.nextEntityId = 1

        this.onEntityCreated(({ entity }) => console.info(`${entity.name}#${entity.id} created`))
        this.onEntityDeleted(({ entity }) => console.info(`${entity.name}#${entity.id} deleted`))
        this.onComponentAdded(({ component, entity }) =>
            console.info(`${component.getType()} component added to ${entity.name}#${entity.id}`),
        )
        this.onComponentRemoved(({ component, entity }) =>
            console.info(
                `${component.getType()} component removed from ${entity.name}#${entity.name}`,
            ),
        )
    }

    public onEntityCreated(callback: (event: EntityCreatedEvent) => void): void {
        this.root.addEventListener(EntityCreatedEvent.NAME, callback as EventListener)
    }

    public onEntityDeleted(callback: (event: EntityDeletedEvent) => void): void {
        this.root.addEventListener(EntityDeletedEvent.NAME, callback as EventListener)
    }

    public onComponentAdded(callback: (event: ComponentAddedEvent) => void): void {
        this.root.addEventListener(ComponentAddedEvent.NAME, callback as EventListener)
    }

    public onComponentRemoved(callback: (event: ComponentRemovedEvent) => void): void {
        this.root.addEventListener(ComponentRemovedEvent.NAME, callback as EventListener)
    }

    public getNeighborsForMovement(): [Coordinate, number][][][] {
        const MOVEMENT_COST_ORTHOGONAL = 2
        const MOVEMENT_COST_DIAGONAL = 3

        const result: [Coordinate, number][][][] = Array.from({ length: this.columns }).map(() =>
            Array.from({ length: this.rows }),
        )

        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                const candidates: [Coordinate, number][] = [
                    [[column - 1, row - 1], MOVEMENT_COST_DIAGONAL], //   NW
                    [[column - 1, row + 0], MOVEMENT_COST_ORTHOGONAL], // W
                    [[column - 1, row + 1], MOVEMENT_COST_DIAGONAL], //   SW
                    [[column + 0, row - 1], MOVEMENT_COST_ORTHOGONAL], // N
                    [[column + 0, row + 1], MOVEMENT_COST_ORTHOGONAL], // S
                    [[column + 1, row - 1], MOVEMENT_COST_DIAGONAL], //   NE
                    [[column + 1, row + 0], MOVEMENT_COST_ORTHOGONAL], // E
                    [[column + 1, row + 1], MOVEMENT_COST_DIAGONAL], //   SE
                ]

                result[column]![row] = candidates.filter(
                    ([neighbor, _cost]) =>
                        neighbor[ROW] >= 0 &&
                        neighbor[ROW] < this.rows &&
                        neighbor[COLUMN] >= 0 &&
                        neighbor[COLUMN] < this.columns &&
                        hasLineOf(this, [column, row], neighbor, [ObstructionType.MOVEMENT]),
                )
            }
        }

        return result
    }

    public findEntities(Classes: Iterable<Class<Component>>, tags: Iterable<Tag>): Entity[] {
        const selectors: string[] = [
            [...Classes].map((Class: Class<Component>) => `.${Component.typeOf(Class)}`).join(''),
            [...tags].map(tag => `.${tag}`).join(''),
        ]

        return [...this.entities.querySelectorAll<ElementWithEntityRef>(selectors.join(''))].map(
            element => element[ENTITY_REF],
        )
    }

    public createEntity({ name, parent }: { name?: string; parent?: Entity } = {}): Entity {
        const element = this.document.createElement('div') as ElementWithEntityRef
        const id = this.nextEntityId++

        element.id = `📂${id.toString(10)}`
        element.title = name ?? element.id

        if (parent) {
            parent.element.append(element)
        } else {
            this.entities.append(element)
        }

        const entity = new Entity(this, id, element)
        element[ENTITY_REF] = entity
        this.root.dispatchEvent(new EntityCreatedEvent(entity))

        return entity
    }

    public removeEntity(entity: Entity): void {
        while (entity.element.childElementCount > 0) {
            // @ts-expect-error
            this.removeEntity(entity.element.firstChild[ENTITY_REF] as Entity)
        }

        const componentTypes = [...entity.element.classList].filter(
            (element): element is ComponentType => isComponentType(element),
        )

        for (const type of componentTypes) {
            this.removeComponent(entity, type)
        }

        entity.element.remove()
        this.root.dispatchEvent(new EntityDeletedEvent(entity))
    }

    public removeComponent<T extends Component>(
        entity: Entity,
        component: T | Class<T> | ComponentType,
    ): void {
        const stylesheet = this.getStyleSheetFor(component)
        const componentMap = stylesheet[ECS_PROPERTIES]
        const current = componentMap.get(entity)

        if (!current) {
            return
        }

        const ruleIndex = ([...stylesheet.cssRules] as CSSStyleRule[]).findIndex(
            rule => rule.selectorText === `._${entity.id}`,
        )
        entity.element.classList.remove(Component.typeOf(component))
        this.root.dispatchEvent(new ComponentRemovedEvent(current, entity))
        if (ruleIndex !== -1) {
            stylesheet.deleteRule(ruleIndex)
        }

        // TODO: Maybe clean up empty stylesheets?
    }

    private getStyleSheetFor<T extends Component>(
        Class: ComponentType | T | Class<T>,
    ): EcsStyleSheet {
        const type = Component.typeOf(Class)
        // The 'style' prefix is obviously overly specific, it's just for documentary purposes
        const styleSheet = this.document.querySelector<EcsStyleSheetUninitialized>(
            `style#${type}[ecs]`,
        )

        if (styleSheet === null) {
            const element = this.document.createElement('style')
            element.id = type
            element.setAttribute('ecs', '')
            this.document.querySelector('head')!.append(element)
            return this.getStyleSheetFor(Class)
        }

        if (!styleSheet[ECS_PROPERTIES]) {
            styleSheet[ECS_PROPERTIES] = new Map()
        }

        return styleSheet as EcsStyleSheet
    }

    public addTag(entity: Entity, tag: Tag): void {
        const classes = entity.element.classList

        if (!classes.contains(tag)) {
            entity.element.classList.add(tag)
            this.root.dispatchEvent(new TagAddedEvent(tag, entity))
        }
    }

    public removeTag(entity: Entity, tag: Tag): void {
        const classes = entity.element.classList

        if (classes.contains(tag)) {
            entity.element.classList.remove(tag)
            this.root.dispatchEvent(new TagRemovedEvent(tag, entity))
        }
    }

    public addComponent<T extends Component>(entity: Entity, component: T): void {
        const type = Component.typeOf(component)
        const componentMap = this.getStyleSheetFor(component)[ECS_PROPERTIES]
        const previous = componentMap.get(entity)

        if (previous === component) {
            return
        }

        if (previous) {
            componentMap.delete(entity)
            this.root.dispatchEvent(new ComponentRemovedEvent(previous, entity))
        } else {
            entity.element.classList.add(type)
        }

        componentMap.set(entity, component)
        this.root.dispatchEvent(new ComponentAddedEvent(component, entity))
    }

    public getComponents(entity: Entity): Component[] {
        const styleSheets = this.document.querySelectorAll<EcsStyleSheet>('head > style[ecs]')

        return [...styleSheets]
            .map(styleSheet => styleSheet[ECS_PROPERTIES].get(entity))
            .filter((maybeComponent): maybeComponent is Component => maybeComponent !== undefined)
    }

    public getComponent<T extends Component>(entity: Entity, Class: Class<T>): T {
        const maybeComponent = this.getStyleSheetFor(Class)[ECS_PROPERTIES].get(entity)

        if (!maybeComponent) {
            throw new Error('Component not found')
        }

        return maybeComponent as T
    }
}

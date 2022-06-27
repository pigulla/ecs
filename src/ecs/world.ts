/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Class, SetRequired } from 'type-fest'

import type { ComponentType } from './component'
import { Component, isComponentType } from './component'
import type { Entity } from './entity'
import {
    ComponentUpdatedEvent,
    ComponentAddedEvent,
    ComponentRemovedEvent,
    EntityCreatedEvent,
    EntityDeletedEvent,
    TagAddedEvent,
    TagRemovedEvent,
} from './event'
import type { GlobalState } from './global-state'
import type { Signal } from './signal'
import type { ISystem } from './system.interface'
import type { Tag } from './tag'
import type { IWorld } from './world.interface'

const ECS_PROPERTIES = '--ecs-properties'

type EcsStyleSheetUninitialized<T extends Component = Component> = CSSStyleSheet &
    Element & {
        [ECS_PROPERTIES]?: Map<Entity, T>
    }
type EcsStyleSheet<T extends Component = Component> = SetRequired<
    EcsStyleSheetUninitialized<T>,
    typeof ECS_PROPERTIES
>

const ENTITY_REF = Symbol('entity-reference')

type ElementWithEntityRef = HTMLDivElement & { [ENTITY_REF]: Entity }

export class World implements IWorld {
    public readonly columns: number
    public readonly rows: number

    private readonly document: Document
    private readonly root: Element
    private readonly entities: ShadowRoot
    private readonly systems: ISystem[]
    private readonly globalStates: Map<Class<GlobalState>, GlobalState>
    private nextEntityId: number
    private signals: Set<Signal>

    public constructor(document: Document, root: Element, data: { rows: number; columns: number }) {
        this.columns = data.columns
        this.rows = data.rows
        this.document = document
        this.root = root
        this.systems = []
        this.signals = new Set()
        this.globalStates = new Map()

        this.entities = this.root.attachShadow({ mode: 'closed' })
        this.nextEntityId = 1
    }

    public step(): void {
        for (const engine of this.globalStates.values()) {
            engine.onStepStart(this.signals)
        }

        for (const system of this.systems) {
            system(this, this.signals)
        }

        this.signals = new Set()
    }

    public addGlobalState<T extends GlobalState>(globalState: T): void {
        const Class = globalState.constructor as Class<T>

        if (this.globalStates.has(Class)) {
            throw new Error('Duplicate global state')
        }

        this.globalStates.set(Class, globalState)
    }

    public getGlobalState<T extends GlobalState>(Class: Class<T>): T {
        const maybeEngine = this.globalStates.get(Class)

        if (!maybeEngine) {
            throw new Error('Global state not found')
        }

        return maybeEngine as T
    }

    public signal(signal: Signal): void {
        if (this.signals.has(signal)) {
            return
        }

        this.signals.add(signal)
        // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
        console.log(`Signal '${signal}' added`)
    }

    public addSystem(system: ISystem): void {
        this.systems.push(system)
    }

    public onTagAdded(callback: (event: TagAddedEvent) => void): void {
        this.root.addEventListener(TagAddedEvent.NAME, event => {
            const onTagAddedEvent = event as TagAddedEvent
            callback(onTagAddedEvent)
        })
    }

    public onTagRemoved(callback: (event: TagRemovedEvent) => void): void {
        this.root.addEventListener(TagRemovedEvent.NAME, event => {
            const onTagRemovedEvent = event as TagRemovedEvent
            callback(onTagRemovedEvent)
        })
    }

    public onEntityCreated(callback: (event: EntityCreatedEvent) => void): void {
        this.root.addEventListener(EntityCreatedEvent.NAME, event => {
            const onEntityCreatedEvent = event as EntityCreatedEvent
            callback(onEntityCreatedEvent)
        })
    }

    public onEntityDeleted(callback: (event: EntityDeletedEvent) => void): void {
        this.root.addEventListener(EntityDeletedEvent.NAME, event => {
            const onEntityDeletedEvent = event as EntityDeletedEvent
            callback(onEntityDeletedEvent)
        })
    }

    public onComponentAdded(callback: (event: ComponentAddedEvent) => void): void {
        this.root.addEventListener(ComponentAddedEvent.NAME, event => {
            const onComponentAddedEvent = event as ComponentAddedEvent
            callback(onComponentAddedEvent)
        })
    }

    public onComponentRemoved(callback: (event: ComponentRemovedEvent) => void): void {
        this.root.addEventListener(ComponentRemovedEvent.NAME, event => {
            const onComponentRemovedEvent = event as ComponentRemovedEvent
            callback(onComponentRemovedEvent)
        })
    }

    public onComponentUpdated<T extends Component>(
        callback: (event: ComponentUpdatedEvent<T>) => void,
    ): void {
        this.root.addEventListener(ComponentUpdatedEvent.NAME, event => {
            const onComponentUpdatedEvent = event as ComponentUpdatedEvent<T>
            callback(onComponentUpdatedEvent)
        })
    }

    public findComponents<T extends Component>(Class: Class<T>): T[] {
        const styleSheet = this.getStyleSheetFor(Class)[ECS_PROPERTIES]

        return [
            ...this.entities.querySelectorAll<ElementWithEntityRef>(`.${Component.typeOf(Class)}`),
        ].map(element => styleSheet.get(element[ENTITY_REF])!)
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

    private entityElement(entity: Entity): ElementWithEntityRef {
        return this.entities.querySelector(`#${entity}`)!
    }

    public createEntity({ name, parent }: { name?: string; parent?: Entity } = {}): Entity {
        // TODO: Check that the name is allowed in a CSS class

        const element = this.document.createElement('div') as ElementWithEntityRef
        const entity = `📂${(this.nextEntityId++).toString(10)}${name ? `-${name}` : ''}` as Entity

        element.id = entity
        if (name) {
            element.title = name
        }

        if (parent) {
            this.entityElement(parent).append(element)
        } else {
            this.entities.append(element)
        }

        element[ENTITY_REF] = entity
        this.root.dispatchEvent(new EntityCreatedEvent(entity))

        return entity
    }

    public removeEntity(entity: Entity): void {
        const element = this.entityElement(entity)
        while (element.childElementCount > 0) {
            this.removeEntity((element.firstChild as ElementWithEntityRef)[ENTITY_REF])
        }

        const componentTypes = [...element.classList].filter((element): element is ComponentType =>
            isComponentType(element),
        )

        for (const type of componentTypes) {
            this.removeComponent(entity, type)
        }

        element.remove()
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
            rule => rule.selectorText === `._${entity}`,
        )
        this.entityElement(entity).classList.remove(Component.typeOf(component))
        this.root.dispatchEvent(new ComponentRemovedEvent(current, entity))
        if (ruleIndex !== -1) {
            stylesheet.deleteRule(ruleIndex)
        }

        // TODO: Maybe clean up empty stylesheets?
    }

    private getStyleSheetFor<T extends Component>(
        Class: ComponentType | T | Class<T>,
    ): EcsStyleSheet<T> {
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

        return styleSheet as EcsStyleSheet<T>
    }

    public addTag(entity: Entity, tag: Tag): void {
        const element = this.entityElement(entity)
        const classes = element.classList

        if (!classes.contains(tag)) {
            element.classList.add(tag)
            this.root.dispatchEvent(new TagAddedEvent(tag, entity))
        }
    }

    public removeTag(entity: Entity, tag: Tag): void {
        const classes = this.entityElement(entity).classList

        if (classes.contains(tag)) {
            classes.remove(tag)
            this.root.dispatchEvent(new TagRemovedEvent(tag, entity))
        }
    }

    public setComponent<T extends Component>(entity: Entity, component: T): void {
        const type = Component.typeOf(component)
        const componentMap = this.getStyleSheetFor(component)[ECS_PROPERTIES]
        const previous = componentMap.get(entity)

        if (previous === component) {
            return
        }

        this.entityElement(entity).classList.add(type)
        componentMap.set(entity, component)

        this.root.dispatchEvent(
            previous
                ? new ComponentUpdatedEvent(component, previous, entity)
                : new ComponentAddedEvent(component, entity),
        )
    }

    public getComponents(entity: Entity): Component[] {
        const styleSheets = this.document.querySelectorAll<EcsStyleSheet>('head > style[ecs]')

        return [...styleSheets]
            .map(styleSheet => styleSheet[ECS_PROPERTIES].get(entity))
            .filter((maybeComponent): maybeComponent is Component => maybeComponent !== undefined)
    }

    public getComponentOf<T extends Component>(entity: Entity, Class: Class<T>): T {
        const maybeComponent = this.getStyleSheetFor(Class)[ECS_PROPERTIES].get(entity)

        if (!maybeComponent) {
            throw new Error('Component not found')
        }

        return maybeComponent
    }

    public getSingletonComponent<T extends Component>(Class: Class<T>): T {
        const components = this.getStyleSheetFor(Class)[ECS_PROPERTIES]

        if (components.size !== 1) {
            throw new Error(`Expected exactly one component but got ${components.size}`)
        }

        return [...components.values()][0]
    }
}

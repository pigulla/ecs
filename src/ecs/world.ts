/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Class, Opaque } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Component {}

export type ComponentType = Opaque<string, 'component-type'>
export type Entity = Opaque<HTMLElement, 'entity'>

export class World {
    private static readonly PROPERTIES = '--ecs-properties'

    private readonly entities: Element
    private nextEntityId: number
    private readonly mutationObserver: MutationObserver

    public constructor() {
        this.entities = document.createElement('div')
        this.nextEntityId = 1

        document.querySelector('body')!.append(this.entities)
        this.entities.setAttribute('style', 'display: none')
        this.entities.classList.add('entities')

        this.mutationObserver = new MutationObserver(this.onMutation.bind(this))
        this.mutationObserver.observe(this.entities, { subtree: true, childList: true })
    }

    private onMutation(mutations: MutationRecord[], _observer: MutationObserver): void {
        for (const mutation of mutations) {
            for (const removedNode of mutation.removedNodes) {
                const entity = removedNode as Entity
                console.log(`Entity '${entity.title}' (#${entity.id}) removed`)
            }
        }
    }

    public findEntities(Classes: Iterable<Class<Component>>): Iterable<Entity> {
        const selector = [...Classes].map((Class: Class<Component>) => `.${Class.name}`).join('')
        return this.entities.querySelectorAll(selector) as Iterable<Entity>
    }

    public createEntity({ name, parent }: { name?: string; parent?: Entity } = {}): Entity {
        const entity = document.createElement('div')
        const id = this.nextEntityId++

        entity.id = id.toString(10)
        entity.title = name ?? entity.id

        if (parent) {
            parent.append(entity)
        } else {
            this.entities.append(entity)
        }

        return entity as unknown as Entity
    }

    public removeEntity(entity: Entity): void {
        while (entity.childElementCount > 0) {
            this.removeEntity(entity.firstChild as Entity)
        }

        for (const name of entity.classList) {
            const type = name as ComponentType
            const styleSheets = this.getStyleSheetFor(type)
            const index = ([...styleSheets.cssRules] as CSSStyleRule[]).findIndex(
                rule => rule.selectorText === `.${entity.id}`,
            )

            if (index !== -1) {
                styleSheets.deleteRule(index)
            }
        }

        entity.remove()
    }

    public removeComponent<T extends Component>(entity: Entity, Class: Class<T>): void {
        const type = Class.name as ComponentType
        const stylesheet = this.getStyleSheetFor(Class)
        const index = ([...stylesheet.cssRules] as CSSStyleRule[]).findIndex(
            rule => rule.selectorText === `.${entity.id}`,
        )

        entity.classList.remove(type)

        if (index !== -1) {
            this.getStyleSheetFor(Class).deleteRule(index)
        }
    }

    private getStyleSheetFor(Class: ComponentType | Class<Component>): CSSStyleSheet {
        const maybeStyleSheet = this.findStyleSheetFor(Class)

        if (maybeStyleSheet === null) {
            throw new Error(`No style sheet found`)
        }

        return maybeStyleSheet
    }

    private findStyleSheetFor(Class: ComponentType | Class<Component>): CSSStyleSheet | null {
        const type = typeof Class === 'string' ? Class : (Class.name as ComponentType)
        const styleSheets = [...document.styleSheets] as CSSStyleSheet[]
        return styleSheets.find((sheet: CSSStyleSheet) => sheet.title === type) ?? null
    }

    public addComponent<T extends Component>(entity: Entity, component: T): void {
        const Class = component.constructor as Class<Component>
        const stylesheet = this.getStyleSheetFor(Class)
        const index = stylesheet.insertRule(`._${entity.id} {}`)
        const rule = stylesheet.cssRules[index] as CSSStyleRule

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rule.style[World.PROPERTIES] = component
        entity.classList.add(component.constructor.name)
    }

    public getComponent<T extends Component>(entity: Entity, Class: Class<T>): T | null {
        const stylesheet = this.getStyleSheetFor(Class)
        const rules = [...stylesheet.cssRules] as CSSStyleRule[]

        const maybeRule = rules.find(rule => rule.selectorText === `._${entity.id}`)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return maybeRule ? (maybeRule.style[World.PROPERTIES] as T) : null
    }

    public registerComponentTypes(...Classes: Class<Component>[]): void {
        for (const Class of Classes) {
            this.registerComponentType(Class)
        }
    }

    public registerComponentType(Class: Class<Component>): void {
        if (this.findStyleSheetFor(Class)) {
            throw new Error(`Component already registered`)
        }

        const element = document.createElement('style')
        element.title = Class.name as ComponentType
        document.querySelector('head')!.append(element)
    }
}

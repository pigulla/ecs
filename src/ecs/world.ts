/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Opaque } from 'type-fest'

export type ComponentType = Opaque<string, 'component-type'>
export type Entity = Opaque<HTMLElement, 'entity'>

export class World {
    private static readonly PROPERTIES = '--ecs-properties'

    private readonly entities: Element

    public constructor() {
        this.entities = document.createElement('div')

        document.querySelector('body')!.append(this.entities)
        this.entities.setAttribute('style', 'display: none')
        this.entities.classList.add('entities')
    }

    public createEntity(key: string): Entity {
        // TODO: Use custom element?
        const entity = document.createElement('div')
        entity.id = key
        this.entities.append(entity)

        return entity as unknown as Entity
    }

    public removeEntity(entity: Element): void {
        entity.remove()
    }

    public removeComponent(entity: Entity, type: ComponentType): void {
        entity.classList.remove(type)
    }

    private getStyleSheetFor(type: ComponentType): CSSStyleSheet {
        const maybeStyleSheet = this.findStyleSheetFor(type)

        if (maybeStyleSheet === null) {
            throw new Error(`No style sheet found for component of type '${type}'`)
        }

        return maybeStyleSheet
    }

    private findStyleSheetFor(type: ComponentType): CSSStyleSheet | null {
        const styleSheets = [...document.styleSheets] as CSSStyleSheet[]
        return styleSheets.find((sheet: CSSStyleSheet) => sheet.title === type) ?? null
    }

    public addComponent<T = unknown>(entity: Entity, type: ComponentType, properties: T): void {
        const stylesheet = this.getStyleSheetFor(type)
        const index = stylesheet.insertRule(`.${entity.id} {}`)
        const rule = stylesheet.cssRules[index] as CSSStyleRule

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rule.style[World.PROPERTIES] = properties
        entity.classList.add(`${type}-${index}`)
    }

    public getComponent<T = unknown>(entity: Entity, type: ComponentType): T | null {
        const stylesheet = this.getStyleSheetFor(type)
        const rules = [...stylesheet.cssRules] as CSSStyleRule[]

        const maybeRule = rules.find(rule => rule.selectorText === `.${entity.id}`)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return maybeRule ? (maybeRule.style[World.PROPERTIES] as T) : null
    }

    public registerComponentType(name: string): ComponentType {
        const type = name as ComponentType

        if (this.findStyleSheetFor(type)) {
            throw new Error(`Component of type '${name}' already registered`)
        }

        const element = document.createElement('style')
        element.title = type
        document.querySelector('head')!.append(element)

        return type
    }
}

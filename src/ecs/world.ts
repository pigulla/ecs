/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-non-null-assertion */
import type { Class, Opaque } from 'type-fest'

import { Component, ObstructionType } from './component'
import { Entity } from './entity'
import type { Coordinate } from './geometry'
import { COLUMN, ROW } from './geometry'
import { hasLineOf } from './system'
import type { IWorld } from './world.interface'

type ComponentName = Opaque<string, 'component-name'>

const ENTITY_REF = Symbol('entity-reference')

export class World implements IWorld {
    private static readonly PROPERTIES = '--ecs-properties'

    public readonly columns: number
    public readonly rows: number

    private readonly entities: Element
    private readonly neighborsForMovement: [Coordinate, number][][][]
    private nextEntityId: number

    public constructor(data: { rows: number; columns: number }) {
        this.columns = data.columns
        this.rows = data.rows
        this.entities = document.createElement('div')
        this.nextEntityId = 1

        document.querySelector('body')!.append(this.entities)
        this.entities.setAttribute('style', 'display: none')
        this.entities.classList.add('entities')
        this.neighborsForMovement = Array.from({ length: data.columns }).map(() =>
            Array.from({ length: data.rows }),
        )

        this.updateNeighborsForMovement()
    }

    public getNeighborsForMovement(
        coordinate: Readonly<Coordinate>,
    ): readonly [Readonly<Coordinate>, number][] {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.neighborsForMovement[coordinate[COLUMN]]![coordinate[ROW]]!
    }

    public updateNeighborsForMovement(): void {
        const MOVEMENT_COST_ORTHOGONAL = 2
        const MOVEMENT_COST_DIAGONAL = 3

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

                this.neighborsForMovement[column]![row] = candidates.filter(
                    ([neighbor, _cost]) =>
                        neighbor[ROW] >= 0 &&
                        neighbor[ROW] < this.rows &&
                        neighbor[COLUMN] >= 0 &&
                        neighbor[COLUMN] < this.columns &&
                        hasLineOf(this, [column, row], neighbor, [ObstructionType.MOVEMENT]),
                )
            }
        }
    }

    public findEntities(Classes: Iterable<Class<Component>>): Entity[] {
        const selector = [...Classes].map((Class: Class<Component>) => `.${Class.name}`).join('')

        return [...this.entities.querySelectorAll(selector)].map(
            // @ts-expect-error
            element => element[ENTITY_REF] as Entity,
        )
    }

    public createEntity({ name, parent }: { name?: string; parent?: Entity } = {}): Entity {
        const element = document.createElement('div')
        const id = this.nextEntityId++

        element.id = id.toString(10)
        element.title = name ?? element.id

        if (parent) {
            parent.element.append(element)
        } else {
            this.entities.append(element)
        }

        const entity = new Entity(this, element)
        // @ts-expect-error
        element[ENTITY_REF] = entity

        return entity
    }

    public removeEntity(entity: Entity): void {
        while (entity.element.childElementCount > 0) {
            // @ts-expect-error
            this.removeEntity(entity.element.firstChild[ENTITY_REF] as Entity)
        }

        for (const name of entity.element.classList) {
            const type = name as ComponentName
            const styleSheets = this.getStyleSheetFor(type)
            const index = ([...styleSheets.cssRules] as CSSStyleRule[]).findIndex(
                rule => rule.selectorText === `._${entity.id}`,
            )

            if (index !== -1) {
                styleSheets.deleteRule(index)
            }
        }

        entity.element.remove()
    }

    public removeComponent<T extends Component>(entity: Entity, component: T | Class<T>): void {
        const Class = (
            component instanceof Component ? component.constructor : component
        ) as Class<T>
        const stylesheet = this.getStyleSheetFor(Class)
        const index = ([...stylesheet.cssRules] as CSSStyleRule[]).findIndex(
            rule => rule.selectorText === `._${entity.id}`,
        )

        entity.element.classList.remove(Class.name)

        if (index !== -1) {
            this.getStyleSheetFor(Class).deleteRule(index)
        }
    }

    private getStyleSheetFor(Class: ComponentName | Class<Component>): CSSStyleSheet {
        const maybeStyleSheet = this.findStyleSheetFor(Class)

        if (maybeStyleSheet === null) {
            throw new Error(`No style sheet found`)
        }

        return maybeStyleSheet
    }

    private findStyleSheetFor(Class: ComponentName | Class<Component>): CSSStyleSheet | null {
        const type = typeof Class === 'string' ? Class : (Class.name as ComponentName)
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
        entity.element.classList.add(component.constructor.name)
    }

    public getComponents(entity: Entity): Component[] {
        const styleSheets = [...document.styleSheets] as CSSStyleSheet[]
        const selectorText = `._${entity.id}`

        return (
            styleSheets
                .flatMap(styleSheet => [...styleSheet.cssRules] as CSSStyleRule[])
                .filter(rule => rule.selectorText === selectorText)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                .map(rule => rule.style[World.PROPERTIES] as Component)
        )
    }

    public findComponent<T extends Component>(entity: Entity, Class: Class<T>): T | null {
        const stylesheet = this.getStyleSheetFor(Class)
        const rules = [...stylesheet.cssRules] as CSSStyleRule[]

        const maybeRule = rules.find(rule => rule.selectorText === `._${entity.id}`)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return maybeRule ? (maybeRule.style[World.PROPERTIES] as T) : null
    }

    public getComponent<T extends Component>(entity: Entity, Class: Class<T>): T {
        const maybeComponent = this.findComponent(entity, Class)

        if (!maybeComponent) {
            throw new Error('Component not found')
        }

        return maybeComponent
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
        element.title = Class.name as ComponentName
        document.querySelector('head')!.append(element)
    }
}
